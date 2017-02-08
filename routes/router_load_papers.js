var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
module.exports = exports = function(req, res){
  var model_id = Number(req.query.model_id);
  var field = Number(req.query.field);
  var year = Number(req.query.year);
  var type = Number(req.query.type);
  var get_papers = GetPapers().year(year).type(type);
  var token_field = field === DOC.TITLE ? 'title_tokens' : 'abstract_tokens';
  get_papers().then(function(data){
    if(model_id){
      return co(function*(){
        var db = yield MongoClient.connect(ConnStat().url());
        var col = db.collection('models');
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
    } else return Promise.resolve(data);
  }).then(function(data){
    res.json(data);
  }).catch(function(err){
    console.log(err);
    res.send(err);
  });
};
