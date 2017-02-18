var WordTree = require('./nlp_word_tree/word_tree');
var GetPapers = require('./db_mongo/get_papers');
var co = require('co');
var get_papers = GetPapers().year(1979);
co(function*(){
  var data = yield get_papers();
  console.log('data', data);
  var word_tree = WordTree().create(data);
  console.log(word_tree.root());
}).catch(function(err){
  console.log(err);
});
