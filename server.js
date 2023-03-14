import { NextFunction, Request, Response, RequestHandler } from 'express';
import { decodeJwt } from 'jose';
import { readFileSync } from 'fs';

const configPath = () => {
  return require('path').resolve(__dirname, './access-rules/access.json');
};

function hasAccess(keyCloakgroups: string[], apiPath: string): boolean {
  const config = readFileSync(configPath(), { encoding: 'utf-8' });
  const jsonData = JSON.parse(config);

  const roleExists = Object.keys(jsonData.groups).filter((grp: string) => {
    return keyCloakgroups.includes(grp);
  });

  if (roleExists.length > 0) {
    const apiAccess = Object.values(jsonData.groups).filter((vals: any) => {
      console.log(vals.includes(apiPath), apiPath, vals);
      return vals.includes(apiPath);
    });
    return apiAccess.length > 0;
  } else {
    return false;
  }
}

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // /api/test/health
    const token = req.headers['x-forwarded-access-token'] as string;
    const apiPath = req.originalUrl.replace('/api', '');
    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    } else {
      const payload = decodeJwt(token);
      const groups: string[] = payload?.groups;
      if (hasAccess(groups, apiPath)) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    }
  } catch (error) {
    res.status(401).send('Unauthorized');
    return;
  }
};
