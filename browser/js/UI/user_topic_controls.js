var DOC = require('../../../flags/doc_flags');
var KeywordTimelineFlags = require('../../../flags/keyword_timeline_flags');
var $ = require('jquery');
var d3 = require('d3');
module.exports.get_flags = get_flags;
module.exports.str2flag = str2flag;
module.exports.disable_opts = disable_opts;
module.exports.enable_opts = enable_opts;
function get_flags(){
  var level_str = $('#user-topic-control-div #select-level').val();
  var type_str = $('#user-topic-control-div #select-type').val();
  var field_str = $('#user-topic-control-div #select-field').val();
  var metric_str = $('#user-topic-control-div #select-metric').val();
  var level = str2flag(level_str);
  var type = str2flag(type_str);
  var field = str2flag(field_str);
  var metric = str2flag(metric_str);
  var percent = $('#user-topic-control-div #checkbox-keyword-timeline-percent').is(':checked');
  return {level:level,type:type,field:field,percent:percent,metric:metric};
}
function str2flag(str){
  switch(str){
    case 'P' : return DOC.P;
    case 'PN' : return DOC.PN;
    case 'A' : return DOC.A;
    case 'RW' : return DOC.RW;
    case 'TITLE' : return DOC.TITLE;
    case 'ABSTRACT' : return DOC.ABSTRACT;
    case 'METRIC_DOCUMENT' : return KeywordTimelineFlags.METRIC_DOCUMENT;
    case 'METRIC_WORD' : return KeywordTimelineFlags.METRIC_WORD;
    case 'ALL' : return -1;
    default : return -1;
  }
}
