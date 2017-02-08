var TopicModel = require('../mallet/topic_model');
var ConnStat = require('../db_mongo/connection');
var mongodb = require('mongodb');
var co = require('co');
var MongoClient = mongodb.MongoClient;
module.exports = exports = function(req, res){
  co(function*(){
    var model_stats = [];
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection('models');
    var models = yield col.find({}).sort({year : 1, level : 1, type : 1, field:1}).toArray();
    db.close();
    models.forEach(function(m){
      var topic_model = TopicModel();
      model_stats.push({
        id : m.id,
        name : m.name,
        year : m.year,
        type : m.type,
        level : m.level,
        field : m.field,
        num_topics : m.num_topics,
        num_iterations : m.num_iterations
      });
    });
    return Promise.resolve(model_stats);
  }).then(function(model_stats){
    res.json(model_stats);
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
