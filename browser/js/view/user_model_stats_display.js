var $ = require('jquery');
var d3 = require('../load_d3');
var co = require('co');
var LoadUserTopics = require('../load/load_user_topics');
var container = '#user-topic-model-stats-div';
var data = [];
var table;
var selected_model = {};
var model_update;

module.exports = exports = display;
function display(){
  function init(){
    table = d3.select(container).append('table')
    .attr('class', 'table')
    .style('width', '90%')
    .style('text-align', 'inherit')
    .style('overflow-wrap', 'break-word')
    .style('word-break', 'break-all')
    .style('word-wrap', 'break-word')
    .style('white-space', 'pre-wrap')
    .style('table-layout', 'fixed')
    .style('padding-right', '0px')
    .style('padding-left', '0px')
    .style('position', 'relative')
    .attr('border', 1);

    var header = table.append('tr').attr('class', 'header');
    header.append('th').attr('class', 'name').attr('align', 'center').style('width', '20%').style('display', 'table-cell').html('name');
    header.append('th').attr('class', 'num-topics').attr('align', 'center').style('width', '20%').style('display', 'table-cell').html('num-dics');
    header.append('th').attr('class', 'radio-td').attr('align', 'center').style('width', '10%').style('display', 'table-cell').html('sel');
    header.append('th').attr('class', 'trash').attr('align', 'center').style('width', '10%').style('display', 'table-cell').html('del');
    return ret;
  }

  function update(){
    var model_sel = table.selectAll('.model').data(data, function(d){return d.name;});
    var model_enter = model_sel.enter().append('tr').attr('class', 'model');
    model_enter.append('td').attr('class', 'name').style('width', '20%');
    model_enter.append('td').attr('class', 'num-topics').attr('align', 'center').style('width', '10%');
    model_enter.append('td').attr('class', 'radio-td').style('width', '10%')
    .append('div').attr('class', 'radio').style('text-align', 'center')
    .append('input').attr('type', 'radio').style('position', 'relative')
    .style('margin-left', '0px');
    model_enter.append('td').attr('class', 'trash').style('width', '10%')
    .append('div').style('text-align', 'center')
    .append('i').attr('class', 'fa fa-trash-o fa-cog fa-1x').style('cursor', 'pointer');
    model_sel.exit().remove();
    model_update = model_sel.merge(model_enter);
    model_update.select('.name').html(function(d){return d.name;});
    model_update.select('.num-topics').html(function(d){return d.topics.length;});
    model_update.select('.radio-td').select('.radio').select('input').on('click', function(d){
      global.controller_user_topics.selected_model(d.name);
    });
    model_update.select('.trash').select('i').on('click', function(d, i){

    });
    return ret;
  }

  function load(){
    return LoadUserTopics().load();
  }
  var ret = {};
  ret.load = load;
  ret.init = init;
  ret.update = update;
  ret.data = function(_){return arguments.length>0 ? (data =_, ret) : data;};
  ret.selected_model = function(_){return arguments.length > 0 ? (selected_model = _, ret) : selected_model;};
  return ret;
}
