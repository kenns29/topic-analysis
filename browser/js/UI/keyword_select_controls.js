var DOC = require('../../../flags/doc_flags');
var $ = require('jquery');
var d3 = require('d3');
module.exports.get_flags = get_flags;
module.exports.str2flag = str2flag;
module.exports.disable_opts = disable_opts;
module.exports.enable_opts = enable_opts;
function get_flags(){
  var level_str = $('#keyword-select-div #select-level').val();
  var type_str = $('#keyword-select-div #select-type').val();
  var field_str = $('#keyword-select-div #select-field').val();
  var level = str2flag(level_str);
  var type = str2flag(type_str);
  var field = str2flag(field_str);
  var percent = $('#keyword-select-div #checkbox-keyword-timeline-percent').is(':checked');
  return {level:level,type:type,field:field,percent:percent};
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
function disable_opts(){
  var level_sel = $('#keyword-select-div #select-level');
  var type_sel = $('#keyword-select-div #select-type');
  var field_sel = $('#keyword-select-div #select-field');
  level_sel.prop('disabled', true), level_sel.css('opacity', 0.3);
  type_sel.prop('disabled', true), type_sel.css('opacity', 0.3);
  field_sel.prop('disabled', true), field_sel.css('opacity', 0.3);
}
function enable_opts(){
  var level_sel = $('#keyword-select-div #select-level');
  var type_sel = $('#keyword-select-div #select-type');
  var field_sel = $('#keyword-select-div #select-field');
  level_sel.prop('disabled', false), level_sel.css('opacity', 1);
  type_sel.prop('disabled', false), type_sel.css('opacity', 1);
  field_sel.prop('disabled', false), field_sel.css('opacity', 1);
}
