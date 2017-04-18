var $ = require('jquery');
var d3 = require('../load_d3');
var LoadKeywordTimelineData = require('../load/load_keyword_timeline_data');
var KeywordSelectControls = require('../UI/keyword_select_controls');
var get_flags = KeywordSelectControls.get_flags;
var co = require('co');
module.exports = exports = function(){
  var ret = {};
  ret.update_all_keyword_timeline = update_all_keyword_timeline;
  ret.insert_keyword_timeline = insert_keyword_timeline;
  ret.remove_keyword_timeline = remove_keyword_timeline;
  return ret;
};
function update_all_keyword_timeline(){
  var flag = get_flags();
  var data = global.multi_keyword_timeline.data();
  var loading = global.multi_keyword_timeline.loading();
  global.multi_keyword_timeline.percent(flag.percent);
  co(function*(){
    $(loading).show();
    for(let i = 0; i < data.length; i++){
      let keyword = data[i].id;
      let line_data = yield LoadKeywordTimelineData().type(flag.type).level(flag.level)
      .percent(flag.percent).metric(flag.metric).load(keyword);
      global.multi_keyword_timeline.replace_timeline(line_data);
    }
    $(loading).hide();
    yield global.multi_keyword_timeline.update();
    var brushes = global.multi_keyword_timeline.brushes();
    if(brushes.is_activated()){
      brushes.activate();
      global.controller_keyword_document_viewer.keywords(data.map(function(d){return d.id;}))
      .year(brushes.domain()[0]).to_year(brushes.domain()[1])
      .update();
    }
  }).catch(function(err){
    console.log(err);
  });
}
function insert_keyword_timeline(keyword){
  console.log('keyword', keyword);
  if(keyword !== null && keyword !== undefined && keyword !== ''){
    keyword = keyword.toLowerCase();
    var flag = get_flags();
    var level = flag.level, type = flag.type, field = flag.field, percent = flag.percent,
    metric = flag.metric;
    co(function*(){
      $(global.multi_keyword_timeline.loading()).show()
      var line_data = yield LoadKeywordTimelineData().type(type).level(level).percent(percent).metric(metric).load(keyword);
      $(global.multi_keyword_timeline.loading()).hide();
      var brushes = global.multi_keyword_timeline.brushes();
      yield global.multi_keyword_timeline.add_timeline(line_data).update();
      var data = global.multi_keyword_timeline.data();
      if(brushes.is_activated()){
        brushes.activate();
        global.controller_keyword_document_viewer.keywords(data.map(function(d){return d.id;}))
        .year(brushes.domain()[0]).to_year(brushes.domain()[1])
        .update();
      }
    }).catch(function(err){
      console.log(err);
    });
  }
}

function remove_keyword_timeline(keyword){
  if(keyword !== null && keyword !== undefined && keyword !== ''){
    co(function*(){
      global.multi_keyword_timeline.remove_timeline(keyword);
      yield global.multi_keyword_timeline.update();
      var data = global.multi_keyword_timeline.data();
      var brushes = global.multi_keyword_timeline.brushes();
      if(brushes.is_activated()){
        global.controller_keyword_document_viewer.keywords(data.map(function(d){return d.id;}))
        .year(brushes.domain()[0]).to_year(brushes.domain()[1])
        .update();
      }
    }).catch(function(err){
      console.log(err);
    });
  }
}
