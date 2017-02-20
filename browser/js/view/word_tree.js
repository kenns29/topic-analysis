var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = exports = word_tree;

var text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
  return d;
}));
var tiny_text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 0, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
  return d * 0.5;
}));

var margin = {top:20, right:120, bottom:20, left:120};
function word_tree(){
  var container = "#keyword-tree-view-div";
  var data;
  var hierarchy;
  var partition;
  var svg, width, height;
  var graph_g, W, H;
  var last_id = 0;
  function init(){
    width = $(container).width(), height = $(container).height();
    svg = d3.select(container).append('svg').attr('class', 'word-tree').attr('width', width).attr('height', height);
    graph_g = svg.append('g');
    return ret;
  }
  function update(source){
    partition = d3.partition(hierarchy).size([height, width]);
    console.log('hierachy', hierarchy);
    hierarchy.x0 = height / 2;
    hierarchy.y0 = 0;
    var nodes = hierarchy.descendants(),
        links = hierarchy.descendants().slice(1);
    var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || d.id = ++last_id;});

    return ret;
  }
  var ret = {};
  ret.data = function(_){
    if(arguments.length > 0){
        data = _;
        hierarchy = d3.hierarchy(data);
        return ret;
    }
    return data;
  };
  ret.init = init;
  ret.update = update;
  return ret;
}
