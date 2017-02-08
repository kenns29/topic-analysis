var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ConnStat = require('../db_mongo/connection');
var co = require('co');
module.exports = exports = function(req, res){
  var id = Number(req.query.id);
  co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection('models');
    yield col.deleteOne({id : id});
    res.send('success');
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
