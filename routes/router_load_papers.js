var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
module.exports = exports = function(req, res){
  var model_name = req.query.model_name;
  var year = Number(req.query.year);
  var get_papers = GetPapers().year(year);
  get_papers().then(function(data){
    if(model_name){
      return co(function*(){
        var db = yield MongoClient.connect(ConnStat().url());
        var col = db.collection('models_test');
        var data_array = yield col.find({name : model_name}).toArray();
        db.close();
        var m = data_array[0];
        let topic_model = TopicModel().load_from_binary(m.model.buffer);
        let id2distr = topic_model.id2distr();
        let id2tokens = topic_model.id2tokens();
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
