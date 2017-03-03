var co = require('co');
var LoadTopicModels = require('../load/load_topic_models');
var DOC = require('../../../flags/doc_flags');
module.exports = exports = function(){
  return co(function*(){
    var data = yield LoadTopicModels().level(DOC.P).type(DOC.A).field(DOC.TITLE).load();
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
};
