var StanfordCoreNLP = require('./nlp/stanford_core_nlp');
var StanfordParser = require('./nlp/stanford_parser');
var co = require('co');
var GetPapers = require('./db_mongo/get_papers');
var MongoClient = require('mongodb').MongoClient;
var ConnStat = require('./db_mongo/connection');
var stanford_core_nlp = StanfordCoreNLP();
var stanford_parser = StanfordParser();
module.exports = co(function*(){
  var get_papers = GetPapers();
  var data = yield get_papers();
  var db = yield MongoClient.connect(ConnStat().url());
  var col = db.collection('papers');
  var bulk = col.initializeOrderedBulkOp();
  stanford_parser.pipeline(stanford_core_nlp());
  for(let i = 0; i < data.length; i++){
    let entry = data[i];
    stanford_parser.annotate(entry.title);
    let list = stanford_parser.tokens();
    bulk.find({id:entry.id}).updateOne({
      $set : {
        tokens : list
      }
    });
  }
  yield bulk.execute();
  db.close();
}).catch(function(err){
  console.log(err);
});
