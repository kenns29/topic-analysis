var co = require('co');
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

module.exports = exports = load;
function load(passport){
  return function(req, res){
    co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('user_topics');
      var models = yield col.find({}).sort({name : 1}).toArray();
      res.json(models);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
