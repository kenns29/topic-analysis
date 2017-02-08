var StanfordCoreNLP = require('./nlp/stanford_core_nlp');
var StanfordParser = require('./nlp/stanford_parser');
var co = require('co');
var GetPapers = require('./db_mongo/get_papers');
var MongoClient = require('mongodb').MongoClient;
var ConnStat = require('./db_mongo/connection');
var stanford_core_nlp = StanfordCoreNLP();
var stanford_parser = StanfordParser();
module.exports = co(function*(){
  var db = yield MongoClient.connect(ConnStat().url());
  var col = db.collection('papers');
  var data = yield col.find({}).toArray();
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
  data = yield col.find({}).toArray();
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
