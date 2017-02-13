var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadTfidf = require('../load/load_tfidf');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
module.exports = exports = function(){
  var select_container = '#keyword-select-div #select-keyword';
  var select_button = '#keyword-select-div #btn-add-word';
  var text_container = '#keyword-select-div #textbox-keyword'
  var data;
  function update(_data){
    if(_data) data = _data;
    sort_words();
    var dat = trunk_words(data);
    var word_sel = d3.select(select_container).selectAll('option').data(dat, function(d){return d.word;});
    var word_enter = word_sel.enter().append('option').attr('value', function(d){return d.word;})
    .html(function(d){return d.word;});
    word_sel.exit().remove();
    return ret;
  }
  function sort_words(){
    data.sort(function(a, b){return b.tfidf - a.tfidf;});
  }
  function trunk_words(data){
    return data.slice(0, 60);
  }
  function load(){
    var flag = get_flags();
    var level = flag.level, type = flag.type, field = flag.field;
    return LoadTfidf().type(type).level(level).field(field).load().then(function(dat){
      data = dat; return Promise.resolve(data);
    });
  }
  function init(){
    // load().then(function(data){
    //   update();
    // });
    $(select_button).click(function(){
      var keyword = $(text_container).val();
      if(keyword !== null && keyword !== undefined && keyword !== ''){
        keyword = keyword.toLowerCase();
        var flag = get_flags();
        var level = flag.level, type = flag.type, field = flag.field;
        LoadKeywordTimelineData().type(type).level(level).load(keyword).then(function(data){
          global.multi_keyword_timeline.add_timeline(data).update();
        }).catch(function(err){
          console.log(err);
        });
      }
    });
    return ret;
  }
  var ret = {};
  ret.init = init;
  ret.load = load;
  ret.update = update;
  return ret;
};
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
