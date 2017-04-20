var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var co = require('co');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var id = Number(req.query.id);
    co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection(model_col);
      yield col.deleteOne({id : id});
      res.send('success');
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
