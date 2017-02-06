var fsp = require('fs-promise');
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
    var models = yield col.find({}).toArray();
    db.close();
    models.forEach(function(m){
      var topic_model = TopicModel();
      topic_model.load_from_binary(m.model.buffer);
      model_stats.push({
        name : m.name,
        num_topics : topic_model.num_topics()
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
