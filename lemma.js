var StanfordCoreNLP = require('./nlp/stanford_core_nlp');
var StanfordParser = require('./nlp/stanford_parser');
var co = require('co');
var MongoClient = require('mongodb').MongoClient;
var ConnStat = require('./db_mongo/connection');
var conn_stat = ConnStat().db('gender_study');
var stanford_core_nlp = StanfordCoreNLP();
var stanford_parser = StanfordParser();
var from_year = 2003;
var to_year = 2014;
module.exports = co(function*(){
  var db = yield MongoClient.connect(conn_stat.url());
  var col = db.collection('papers');
  var data = yield col.find({year : {$gte : from_year, $lt : to_year}}).sort({year :1}).toArray();
  var bulk = col.initializeOrderedBulkOp();
  stanford_parser.pipeline(stanford_core_nlp());
  for(let i = 0; i < data.length; i++){
    let entry = data[i];
    let set_obj = {};
    stanford_parser.annotate(entry.title);
    set_obj.title_tokens = stanford_parser.tokens();
    if(entry.abstract){
      stanford_parser.annotate(entry.abstract);
      set_obj.abstract_tokens = stanford_parser.tokens();
    }
    bulk.find({id:entry.id}).updateOne({$set : set_obj});
  }
  yield bulk.execute();
  console.log('finished papers');

  col = db.collection('panels')
  data = yield col.find({year : {$gte : from_year, $lt : to_year}}).sort({year : 1}).toArray();
  bulk = col.initializeOrderedBulkOp();
  for(let i = 0; i < data.length; i++){
    let entry = data[i];
    let set_obj = {};
    stanford_parser.annotate(entry.title);
    set_obj.title_tokens = stanford_parser.tokens();
    if(entry.abstract){
      stanford_parser.annotate(entry.abstract);
      set_obj.abstract_tokens = stanford_parser.tokens();
    }
    bulk.find({id:entry.id}).updateOne({$set : set_obj});
  }
  yield bulk.execute();
  console.log('finished panels');
  db.close();
}).catch(function(err){
  console.log(err);
});
