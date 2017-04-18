var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadTfidf = require('../load/load_tfidf');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var KeywordSelectControls = require('./keyword_select_controls');
var co = require('co');
var get_flags = KeywordSelectControls.get_flags;
var str2flag = KeywordSelectControls.str2flag;
var disable_opts = KeywordSelectControls.disable_opts;
var enable_opts = KeywordSelectControls.enable_opts;
var WordCombo = require('../../../db_mongo/word_combo');
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
    var word_combo = WordCombo();
    var update_all_keyword_timeline = global.controller_keyword.update_all_keyword_timeline;
    var insert_keyword_timeline = global.controller_keyword.insert_keyword_timeline;
    $('#keyword-select-div #btn-add-word').click(function(){
      var plain = $('#keyword-select-div #textbox-keyword').val();
      var hr = word_combo.plain2hr(plain);
      insert_keyword_timeline(hr);
    });
    $('#keyword-select-div #select-level').change(update_all_keyword_timeline);
    $('#keyword-select-div #select-type').change(update_all_keyword_timeline);
    $('#keyword-select-div #select-field').change(update_all_keyword_timeline);
    $('#keyword-select-div #select-metric').change(update_all_keyword_timeline);
    $('#keyword-select-div #checkbox-keyword-timeline-percent').change(update_all_keyword_timeline);
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
