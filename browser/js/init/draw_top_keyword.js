var $ = require('jquery');
var LoadTopKeywordData = require('../load/load_top_keyword_data');
var co = require('co');

co(function*(){
  //   let keyword = keywords[i];
  let data = yield LoadTopKeywordData().load();
  // global.top_keywords.add(data);
  // global.top_keywords.update();
  console.log("before");
  global.top_keywords.addData(data);
  console.log("after");
}).catch(function(err){
  console.log(err);
});
