var DOC = require('../../../flags/doc_flags');
var $ = require('jquery');
var d3 = require('d3');
module.exports.get_flags = get_flags;
module.exports.str2flag = str2flag;
module.exports.disable_opts = disable_opts;
module.exports.enable_opts = enable_opts;
module.exports.init_year_select = function(){
  var start_year = 1979;
  var end_year = 2003;
  d3.select('#keyword-tree-from-year').selectAll('option').data(d3.range(start_year, end_year+1, 1))
  .enter().append('option').attr('value', function(d){return d;})
  .html(function(d){return d;});
  d3.select('#keyword-tree-to-year').selectAll('option').data(d3.range(start_year, end_year+1, 1))
  .enter().append('option').attr('value', function(d){return d;})
  .html(function(d){return d;});
  d3.select('#keyword-tree-to-year').selectAll('option').filter(function(d){return d === end_year;})
  .attr('selected', '');
};
function get_flags(){
  var level_str = $('#keyword-tree-control-div #select-level').val();
  var type_str = $('#keyword-tree-control-div #select-type').val();
  var field_str = $('#keyword-tree-control-div #select-field').val();
  var year_str = $('#keyword-tree-from-year').val();
  var to_year_str = $('#keyword-tree-to-year').val();
  var level = str2flag(level_str);
  var type = str2flag(type_str);
  var field = str2flag(field_str);
  var year = Number(year_str);
  var to_year = Number(to_year_str);
  var use_stopwords = $('#checkbox-word-tree-filter-stop-words').is(':checked');
  var use_lemma = $('#checkbox-word-tree-use-lemma').is(':checked');
  return {level:level,type:type,field:field,year:year,to_year:to_year,
    use_stopwords:use_stopwords,use_lemma:use_lemma};
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
  var level_sel = $('#keyword-tree-control-div #select-level');
  var type_sel = $('#keyword-tree-control-div #select-type');
  var field_sel = $('#keyword-tree-control-div #select-field');
  level_sel.prop('disabled', true), level_sel.css('opacity', 0.3);
  type_sel.prop('disabled', true), type_sel.css('opacity', 0.3);
  field_sel.prop('disabled', true), field_sel.css('opacity', 0.3);
}
function enable_opts(){
  var level_sel = $('#keyword-tree-control-div #select-level');
  var type_sel = $('#keyword-tree-control-div #select-type');
  var field_sel = $('#keyword-tree-control-div #select-field');
  level_sel.prop('disabled', false), level_sel.css('opacity', 1);
  type_sel.prop('disabled', false), type_sel.css('opacity', 1);
  field_sel.prop('disabled', false), field_sel.css('opacity', 1);
}
