var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
module.exports = exports = function(req, res){
  var name = req.query.name;
  var year = Number(req.query.year);
  var num_topics = Number(req.query.num_topics);
  var num_iterations = Number(req.query.num_iterations);
  var get_papers = GetPapers().year(year);
  var topic_model = TopicModel();
  get_papers().then(function(data){
    if(!data || data.length === 0) return Promise.reject('NO_DATA');
    topic_model.num_iterations(num_iterations).num_topics(num_topics);
    return topic_model.build(data);
  }).then(function(){
    var bin = topic_model.serializeBinary();
    var buffer = Buffer.from(bin, 'binary');
    return co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('models_test');
      var bulk = col.initializeOrderedBulkOp();
      bulk.find({name:name}).upsert().updateOne({
        name : name,
        year : year,
        model : new mongodb.Binary(buffer)
      });
      yield bulk.execute();
      db.close();
      var json = topic_model.get_topics_with_id(10);
      res.json(json);
    });
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
