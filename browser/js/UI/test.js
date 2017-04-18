var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var co = require('co');
var KeywordTimelineFlags = require('../../../flags/keyword_timeline_flags');
var service_url = require('../service');
var ur2hr = require('../../../db_mongo/word_combo/ur2hr');
module.exports = exports = $('#test').click(function(){
  co(function*(){
    // var input = '^%key%_%word% & %word%';
    var input = 'key&word/woman';
    var data = yield load().keyword(ur2hr(input)).load();
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
});


function load(){
  var data;
  var type = DOC.A;
  var level = DOC.P;
  var field = DOC.TITLE;
  var percent = false;
  var metric = KeywordTimelineFlags.METRIC_DOCUMENT;
  var keyword = '';
  function load(_keyword){
    if(_keyword) keyword = _keyword;
    var deferred = $.ajax({
      url : service_url + '/test',
      data : {type:type,level:level,field:field,keyword:keyword,percent:percent,metric:metric},
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(_keyword){
    if(_keyword) keyword = _keyword;
    return load();
  }
  ret.data = function(){return data;};
  ret.load = load;
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.keyword = function(_){return arguments.length > 0 ? (keyword = _, ret) : keyword;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.percent = function(_){return arguments.length > 0 ? (percent = _, ret) : percent;};
  ret.metric = function(_){return arguments.length > 0 ? (metric = _, ret) : metric;};
  return ret;
};
// module.exports = exports = $('#test').click(function(){
//   co(function*(){
//     var loading = global.word_tree.loading();
//     $(loading).show();
//     var data = yield LoadWordTree().root_word('lesbian').year(-1)
//     .direction(DIRECTION.FORWARD).load();
//
//     // console.log('data', JSON.stringify(data));
//     global.word_tree.data(data);
//     data = yield LoadWordTree().root_word('lesbian').year(-1)
//     .direction(DIRECTION.REVERSE).load();
//     $(loading).hide();
//     global.word_tree.data(data, true);
//     global.word_tree.update();
//   }).catch(function(err){
//     console.log(err);
//   });
// });
