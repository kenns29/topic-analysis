var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadTfidf = require('../load/load_tfidf');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var co = require('co');
module.exports = exports = function(){
  var data;
  function update(_data){
    if(_data) data = _data;
    sort_words();
    var dat = trunk_words(data);
    var word_sel = d3.select('#keyword-select-div #select-keyword').selectAll('option').data(dat, function(d){return d.word;});
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
    $('#keyword-select-div #btn-add-word').click(function(){
      insert_keyword_timeline($('#keyword-select-div #textbox-keyword').val());
    });
    $('#keyword-select-div #select-level').change(update_all_keyword_timeline);
    $('#keyword-select-div #select-type').change(update_all_keyword_timeline);
    $('#keyword-select-div #select-field').change(update_all_keyword_timeline);
    return ret;
  }
  var ret = {};
  ret.init = init;
  ret.load = load;
  ret.update = update;
  return ret;
};
function update_all_keyword_timeline(){
  var flag = get_flags();
  var data = global.multi_keyword_timeline.data();
  co(function*(){
    for(let i = 0; i < data.length; i++){
      let keyword = data[i].id;
      let line_data = yield LoadKeywordTimelineData().type(flag.type).level(flag.level).load(keyword);
      global.multi_keyword_timeline.replace_timeline(line_data);
    }
    global.multi_keyword_timeline.update();
  }).catch(function(err){
    console.log(err);
  });
}
function insert_keyword_timeline(keyword){
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
}
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
