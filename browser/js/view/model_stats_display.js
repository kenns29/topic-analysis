var $ = require('jquery');
var d3 = require('../load_d3');
var LoadTopicModelStats = require('../load/load_topic_model_stats');
var LoadTopicModel = require('../load/load_topic_model');
var DeleteTopicModel = require('../load/delete_topic_model');
var LoadPapers = require('../load/load_papers');
var LoadPanels = require('../load/load_panels');
var DOC = require('../../../flags/doc_flags');
var co = require('co');
var container = '#topic-model-display-div';
var data = [];
var table;
var selected_model = {};
function init(){
  table = d3.select(container).append('table')
  .attr('class', 'table')
  .style('width', '90%')
  .style('padding-right', '0px')
  .style('padding-left', '0px')
  .style('position', 'relative')
  .attr('border', 1);

  var header = table.append('tr').attr('class', 'header');
  header.append('td').attr('class', 'name').attr('align', 'center').style('width', '20%').html('name');
  header.append('td').attr('class', 'year').attr('align', 'center').style('width', '20%').html('year');
  header.append('td').attr('class', 'type').attr('align', 'center').style('width', '10%').html('type');
  header.append('td').attr('class', 'level').attr('align', 'center').style('width', '10%').html('P/PN');
  header.append('td').attr('class', 'field').attr('align', 'center').style('width', '10%').html('title-abs');
  header.append('td').attr('class', 'num-topics').attr('align', 'center').style('width', '10%').html('num-topics');
  header.append('td').attr('class', 'radio-td').attr('align', 'center').style('width', '10%').html('sel');
  header.append('td').attr('class', 'trash').attr('align', 'center').style('width', '10%').html('del');
  return ret;
}

function update(){
  var model_sel = table.selectAll('.model').data(data, function(d){return d.id;});
  var model_enter = model_sel.enter().append('tr').attr('class', 'model');
  model_enter.append('td').attr('class', 'name').style('width', '20%');
  model_enter.append('td').attr('class', 'year').attr('align', 'center').style('width', '20%');
  model_enter.append('td').attr('class', 'type').attr('align', 'center').style('width', '10%');
  model_enter.append('td').attr('class', 'level').attr('align', 'center').style('width', '10%');
  model_enter.append('td').attr('class', 'field').attr('align', 'center').style('width', '10%')
  model_enter.append('td').attr('class', 'num-topics').attr('align', 'center').style('width', '10%');
  model_enter.append('td').attr('class', 'radio-td').style('width', '10%')
  .append('div').attr('class', 'radio').style('text-align', 'center')
  .append('input').attr('type', 'radio').style('position', 'relative')
  .style('margin-left', '0px');
  model_enter.append('td').attr('class', 'trash').style('width', '10%')
  .append('div').style('text-align', 'center')
  .append('i').attr('class', 'fa fa-trash-o fa-cog fa-1x').style('cursor', 'pointer');
  model_sel.exit().remove();
  var model_update = table.selectAll('.model');
  model_update.select('.name').html(function(d){return d.name;});
  model_update.select('.year').html(function(d){return d.year;});
  model_update.select('.type').html(function(d){return flag2str(d.type);});
  model_update.select('.level').html(function(d){return flag2str(d.level);});
  model_update.select('.field').html(function(d){return flag2str(d.field);});
  model_update.select('.num-topics').html(function(d){return d.num_topics;});
  model_update.select('.radio-td').select('.radio').select('input').on('click', function(d){
    selected_model = d;
    model_update.filter(function(g){
      return g.id !== d.id;
    }).select('.radio-td').select('.radio').select('input').each(function(){
      this.checked = false;
    });
    co(function*(){
      $(global.topic_viewer.loading()).show();
      var topics = yield LoadTopicModel().id(d.id).load();
      $(global.topic_viewer.loading()).hide();
      yield global.topic_viewer.data(topics).update();
      var data = yield global.document_viewer.year(d.year).type(d.type).level(d.level).load();
      console.log(d.year, d.type, d.level);
      global.document_viewer.data(data).update();
    }).catch(function(err){
      console.log(err);
      $(global.topic_viewer.loading()).hide();
    });
  });
  model_update.select('.trash').select('i').on('click', function(d, i){
    DeleteTopicModel().id(d.id).load().then(function(status){
        data.splice(i, 1); update();
    }).catch(function(err){
      console.log(err);
      alert('did not delete the model successfully');
    });
  });
  return ret;
}
function flag2str(flag){
  switch(flag){
    case DOC.P : return 'P';
    case DOC.PN : return 'PN';
    case DOC.A : return 'A';
    case DOC.RW : return 'RW';
    case DOC.TITLE : return 't';
    case DOC.ABSTRACT : return 'abs';
    default : return '';
  }
}
function load(){
  return LoadTopicModelStats()();
}
var ret = {};
ret.load = load;
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length>0 ? (data =_, ret) : data;};
ret.selected_model = function(){return selected_model;};
module.exports = init();
