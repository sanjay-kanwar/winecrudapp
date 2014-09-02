var mongo = require('mongodb');

var Server = mongo.Server;
Db = mongo.Db,
   BSON = mongo.BSONPure;

var server = new Server('localhost', 27107, {auto_reconnect:true});
db = new Db('winedb', server);
db.open(function(err, db){
		if(!err){
		console.log("Connected tp 'winedb' database");
		db.collection('wines', {strict:true}, function(err, collection){
			if(err){
			populateDb();
			}

			});
		}
		});


exports.findById= function(req,res){
	var id = req.params.id;
	console.log('Reetriving wine:' + id);
	db.collection('wines', function(err, collection){
			collection.findOne({'_id': new BSON.ObjectId(id)}, function(err,item){
				res.send(item);
				});
			});

};


	
