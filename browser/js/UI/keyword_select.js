var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadTfidf = require('../load/load_tfidf');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var UpdateKeywordDocumentViewer = require('../control/update_keyword_document_viewer');
var KeywordSelectControls = require('./keyword_select_controls');
var co = require('co');
var get_flags = KeywordSelectControls.get_flags;
var str2flag = KeywordSelectControls.str2flag;
var disable_opts = KeywordSelectControls.disable_opts;
var enable_opts = KeywordSelectControls.enable_opts;
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
  ret.get_flags = get_flags;
  ret.str2flag = str2flag;
  ret.disable_opts = disable_opts;
  ret.enable_opts = enable_opts;
  return ret;
};
function update_all_keyword_timeline(){
  var flag = get_flags();
  var data = global.multi_keyword_timeline.data();
  var loading = global.multi_keyword_timeline.loading();
  co(function*(){
    $(loading).show();
    for(let i = 0; i < data.length; i++){
      let keyword = data[i].id;
      let line_data = yield LoadKeywordTimelineData().type(flag.type).level(flag.level).load(keyword);
      global.multi_keyword_timeline.replace_timeline(line_data);
    }
    $(loading).hide();
    yield global.multi_keyword_timeline.update();
    var brushes = global.multi_keyword_timeline.brushes();
    if(brushes.is_activated()){
      UpdateKeywordDocumentViewer().keywords(data.map(function(d){return d.id;}))
      .update_domain(global.multi_keyword_timeline.brushes().domain());
    }
  }).catch(function(err){
    console.log(err);
  });
}
function insert_keyword_timeline(keyword){
  if(keyword !== null && keyword !== undefined && keyword !== ''){
    keyword = keyword.toLowerCase();
    var flag = get_flags();
    var level = flag.level, type = flag.type, field = flag.field, percent = flag.percent;
    LoadKeywordTimelineData().type(type).level(level).percent(percent).load(keyword).then(function(data){
      global.multi_keyword_timeline.add_timeline(data).update();
    }).catch(function(err){
      console.log(err);
    });
  }
}
