var TopicModel = require('../mallet/topic_model');
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var co = require('co');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var str2array = require('./str2array');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var ids = str2array(req.query.ids);
    var name = req.query.name;
    var year = Number(req.query.year);
    var level = Number(req.query.level);
    var type = Number(req.query.type);
    var level = Number(req.query.level);
    var field = Number(req.query.field);
    function query_maker(){
      if(ids.length > 0){
        return {id : {$in : ids}};
      } else {
        let q = {};
        if(year > 0) q.year = year;
        if(level > 0) q.level = level;
        if(type > 0) q.type = type;
        if(field > 0) q.field = field;
        if(name !== '') q.name = name;
        return q;
      }
    }
    co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection(model_col);
      var data_array = yield col.find(query_maker()).toArray();
      db.close();
      var models = data_array.map(function(m){
        var topic_model = TopicModel().load_from_binary(m.model.buffer);
        return {
          id : m.id,
          year : m.year,
          type : m.type,
          field : m.field,
          name : m.name,
          level : m.level,
          topics : topic_model.get_topics_with_id(20)
        };
      });
      return Promise.resolve(models);
    }).then(function(json){
      res.json(json);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
