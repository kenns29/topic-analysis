var GetPapers = require('../db_mongo/get_papers');
var GetPanels = require('../db_mongo/get_panels');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var DOC = require('../flags/doc_flags');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var name = req.query.name;
    var year = Number(req.query.year);
    var num_topics = Number(req.query.num_topics);
    var num_iterations = Number(req.query.num_iterations);
    var type = Number(req.query.type);
    var level = Number(req.query.level);
    var field = Number(req.query.field);
    var topic_model = TopicModel();
    if(field === DOC.TITLE) topic_model.doc('title_tokens');
    else if(field === DOC.ABSTRACT) topic_model.doc('abstract_tokens');
    co(function*(){
      if(level === DOC.P) return GetPapers().type(type).year(year).load();
      else if(level === DOC.PN) return GetPanels().type(type).year(year).load();
    }).then(function(data){
      if(!data || data.length === 0) return Promise.reject('NO_DATA');
      topic_model.num_iterations(num_iterations).num_topics(num_topics);
      return topic_model.build(data);
    }).then(function(){
      var bin = topic_model.serializeBinary();
      var buffer = Buffer.from(bin, 'binary');
      return co(function*(){
        var db = yield MongoClient.connect(ConnStat().url());
        var col = db.collection(model_col);
        var bulk = col.initializeOrderedBulkOp();
        var id = Number(year + '' + level + '' + type + '' + field);
        bulk.find({id:id}).upsert().updateOne({
          id : id,
          name : name,
          year : year,
          type : type,
          level : level,
          field : field,
          num_topics : num_topics,
          num_iterations : num_iterations,
          model : new mongodb.Binary(buffer)
        });
        yield bulk.execute();
        db.close();
        var json = topic_model.get_topics_with_id(20);
        res.json(json);
      });
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
