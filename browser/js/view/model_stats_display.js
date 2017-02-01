var $ = require('jquery');
var d3 = require('../load_d3');
var LoadTopicModelStats = require('../load/load_topic_model_stats');
var LoadTopicModel = require('../load/load_topic_model');
var DeleteTopicModel = require('../load/delete_topic_model');
var LoadPapers = require('../load/load_papers');
var DelayPromise = require('../util').DelayPromise;
var container = '#topic-model-display-div';
var data = [];
var table;
var selected_model = {};
function init(){
  table = d3.select(container).append('table')
  .attr('class', 'table')
  .style('width', '100%')
  .style('position', 'relative')
  .attr('border', 1);
  return ret;
}

function update(){
  var model_sel = table.selectAll('.model').data(data, function(d){return d.name;});
  var model_enter = model_sel.enter().append('tr').attr('class', 'model');
  model_enter.append('td').attr('class', 'name').style('width', '60%');
  model_enter.append('td').attr('class', 'num-topics').style('width', '20%');
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
  model_update.select('.num-topics').html(function(d){return d.num_topics;});
  model_update.select('.radio-td').select('.radio').select('input').on('click', function(d){
    selected_model = d;
    model_update.filter(function(g){
      return g.name !== d.name;
    }).select('.radio-td').select('.radio').select('input').each(function(){
      this.checked = false;
    });
    $(global.topic_viewer.loading()).show();
    LoadTopicModel().model_name(d.name).load().then(function(topics){
      $(global.topic_viewer.loading()).hide();
      return global.topic_viewer.data(topics).update();
    }).then(DelayPromise(global.topic_viewer.duration()))
    .then(function(){
      return global.document_viewer.load();
    }).then(function(data){
      global.document_viewer.data(data).update();
    });
  });
  model_update.select('.trash').select('i').on('click', function(d, i){
    DeleteTopicModel().model_name(d.name).load().then(function(status){
      if(status === 'success'){
        data.splice(i, 1);
        update();
      } else alert('did not delete the model successfully.');
    }).catch(function(err){
      console.log(err);
      alert('did not delete the model successfully');
    });
  });
  return ret;
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
