var TopicModel = require('../mallet/topic_model');
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var co = require('co');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

module.exports = exports = function(req, res){
  var id = Number(req.query.id);
  co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection(model_col);
    var data_array = yield col.find({id : id}).toArray();
    db.close();
    var m = data_array[0];
    var topic_model = TopicModel().load_from_binary(m.model.buffer);
    return Promise.resolve(topic_model.get_topics_with_id(10));
  }).then(function(json){
    res.json(json);
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
