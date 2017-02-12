var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var co = require('co');
module.exports = exports = function(){
  var keywords = ['woman', 'study', 'feminist'];
  var flag = get_flags();
  var level = flag.level, type = flag.type, field = flag.field;
  co(function*(){
    for(let i = 0; i < keywords.length;i++){
      let keyword = keywords[i];
      let data = yield LoadKeywordTimelineData().type(type).level(level).load(keyword);
      global.multi_keyword_timeline.add_timeline(data);
    }
    global.multi_keyword_timeline.update();
  }).catch(function(err){
    console.log(err);
  });
};
function get_flags(){
  var level_str = $('#keyword-select-div #select-level').val();
  var type_str = $('#keyword-select-div #select-type').val();
  var field_str = $('#keyword-select-div #select-field').val();
  var level = str2flag(level_str);
  var type = str2flag(type_str);
  var field = str2flag(field_str);
  return {level:level,type:type,field:field};
}
function str2flag(str){
  switch(str){
    case 'P' : return DOC.P;
    case 'PN' : return DOC.PN;
    case 'A' : return DOC.A;
    case 'RW' : return DOC.RW;
    case 'TITLE' : return DOC.TITLE;
    case 'ABSTRACT' : return DOC.ABSTRACT;
    case 'ALL' : return -1;
    default : return -1;
  }
}
