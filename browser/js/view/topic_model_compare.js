var d3 = require('../load_d3');
var $ = require('jquery');
var Tooltip = require('./tooltip');
module.exports = exports = topic_model_compare;
function topic_model_compare(){
  var container = '#model-compare-div';
  var nodes;
  var links;
  var models;
  var x_space = 50;
  var y_space = 5;
  var node_width = 20, node_height = 10;
  var svg, width = 800, height = 400;
  var graph_g, W, H;

  var model_id2nodes = [];
  function init(){
    svg = d3.select(container).append('svg')
    .attr('class', 'topic-model-compare').attr('width', '100%')
    .attr('height', '100%').attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", '0 0 '+width+' '+height);
    graph_g = svg.append('g');
    zoom = d3.zoom().on('zoom', function(d){
      var x = d3.event.transform.x, y = d3.event.transform.y, k = d3.event.transform.k;
      graph_g.attr('transform', 'translate(' + [x, y] + ')scale('+k+')');
    });
    svg.call(zoom);
    tooltip = Tooltip().container(container).html(function(d){return d;})();
    loading = d3.select(container).select('.loading').node();
    return ret;
  }
  function update(){
    var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id;});
    var node_enter = node_sel.enter().append('g').attr('class', 'node');
    var node_exit = node_sel.exit();
    var node_update = node_sel.merge(node_enter);
    node_enter.append('rect').attr('width', node_width).attr('height', node_height)
    .attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 1);
    node_update.transition().duration(700).attr('transform', function(d){
      return 'translate(' +[d.x, d.y]+')';
    });
    return ret;
  }
  var ret = {};
  ret.init = init;
  ret.update = update;
  ret.models = function(_){
    if(arguments.length > 0){
      models = _;
      nodes = models2nodes(models);
      model_id2nodes = model_id2nodes_factory(nodes);
      return ret;
    } else return models;
  };
  return ret;

  function models2nodes(models){
    var nodes = flatten_topics(models);
    var year2index = year2index_factory(models);
    nodes.forEach(function(node){
      var x_index = year2index(node.year);
      node.x = x_index * (node_width + x_space);
      node.y = node.topic_id * (node_height + y_space);
    });
    return nodes;
  }

}
function compute_links(nodes, model_id2nodes){

}
function year2index_factory(models){
  var year2index = [];
  models.forEach(function(d, i){year2index[d.year] = i;});
  return function(year){
    return year2index[year];
  };
}
function model_id2nodes_factory(nodes){
  var model2nodes = [];
  nodes.forEach(function(node){
    var t = model2nodes[node.model_id];
    if(!t) t = model2nodes[node.model_id] = [];
    t.push(node);
  })
  return model2nodes;
}
function flatten_topics(models){
  var topics = [];
  models.forEach(function(model){
    model.topics.forEach(function(topic){
      topics.push({
        id : model.id + '-' + topic.id,
        model_id : model.id,
        topic_id : topic.id,
        type : model.type,
        field : model.field,
        year : model.year,
        tokens : topic.tokens
      });
    });
  });
  return topics;
}
