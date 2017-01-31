var $ = require('jquery');
var d3 = require('../load_d3');
var load_topic_model_stats = require('../load/load_topic_model_stats');
var container = '#topic-model-display-div';
var data;
var table;
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
  model_enter.append('td').attr('class', 'num-topics').style('width', '30%');
  model_enter.append('td').attr('class', 'radio-td').style('width', '10%')
  .append('div').attr('class', 'radio').style('text-align', 'center')
  .append('input').attr('type', 'radio').style('position', 'relative')
  .style('margin-left', '0px');
  model_sel.exit().remove();
  var model_update = table.selectAll('.model');
  model_update.select('.name').html(function(d){return d.name;});
  model_update.select('.num-topics').html(function(d){return d.num_topics;});
  model_update.select('.radio-td').select('.radio').select('input').on('click', function(d){
    model_update.filter(function(g){
      return g.name !== d.name;
    }).select('.radio-td').select('.radio').select('input').each(function(){
      this.checked = false;
    });
  });
  return ret;
}
function load(){
  return load_topic_model_stats();
}
var ret = {};
ret.load = load;
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length>0 ? (data =_, ret) : data;};
module.exports = init();
