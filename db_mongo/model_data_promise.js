var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('./connection');
var model_col = require('./model_col');
module.exports = exports = function model_data_promise(data, model_id, token_field){
  return co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection(model_col);
    var data_array = yield col.find({id : model_id}).toArray();
    db.close();
    var m = data_array[0];
    let topic_model = TopicModel().load_from_binary(m.model.buffer);
    let id2pos2token = topic_model.id2pos2token(data, token_field);
    let id2distr = topic_model.id2distr();
    let id2tokens = topic_model.id2tokens(id2pos2token);
    data.forEach(function(d){
      d.topic_distr = id2distr[d.id];
      d.topic_tokens = id2tokens[d.id];
    });
    return Promise.resolve(data);
  });
}
