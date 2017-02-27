var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var co = require('co');
var KeywordSelectControls = require('../UI/keyword_select_controls');
var get_flags = KeywordSelectControls.get_flags;
var str2flag = KeywordSelectControls.str2flag;
module.exports = exports = function(){
  var keywords = ['woman', 'study', 'feminist'];
  var flag = get_flags();
  var level = flag.level, type = flag.type, field = flag.field, metric = flag.metric;
  co(function*(){
    for(let i = 0; i < keywords.length;i++){
      let keyword = keywords[i];
      let data = yield LoadKeywordTimelineData().type(type).level(level)
      .metric(metric).load(keyword);
      global.multi_keyword_timeline.add_timeline(data);
    }
    global.multi_keyword_timeline.update();
  }).catch(function(err){
    console.log(err);
  });
};
