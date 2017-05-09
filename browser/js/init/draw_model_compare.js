var co = require('co');
var LoadTopicModels = require('../load/load_topic_models');
var DOC = require('../../../flags/doc_flags');

return co(function*(){
  var data = yield LoadTopicModels().level(DOC.P).type(DOC.A).field(DOC.TITLE).load();
  console.log('data', data);
  global.topic_model_compare.models(data).update();
}).catch(function(err){
  console.log(err);
});
