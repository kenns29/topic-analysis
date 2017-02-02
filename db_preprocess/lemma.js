var StanfordCoreNLP = require('../nlp/stanford_core_nlp');
var StanfordParser = require('../nlp/stanford_parser');
var co = require('co');
var GetPapers = require('../db_mongo/get_papers');

var stanford_core_nlp = StanfordCoreNLP();
var stanford_parser = StanfordParser();
module.exports = co(function*(){
  var get_papers = GetPapers();
  var data = yield get_papers();
  // console.log('data', data);
  var pipeline = stanford_core_nlp();
  stanford_parser.pipeline(pipeline);
  stanford_parser.annotate(data);
  var list = stanford_parser.tokens();
  cosnole.log('list', list);
}).catch(function(err){
  console.log(err);
});
