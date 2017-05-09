var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ConnStat = require('../db_mongo/connection');
var co = require('co');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var name = req.query.name;
    co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('user_topics');
      yield col.deleteOne({name : name});
      res.send('success');
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
