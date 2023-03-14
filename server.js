var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var	wine = require('./routes/wines');

var app = express();

app.get('wines/:id', wine.findById);



app.listen(3000);
console.log("Listening to port 3000...");
