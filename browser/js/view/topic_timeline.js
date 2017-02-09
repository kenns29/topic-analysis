var d3 = require('../load_d3');
var $ = require('jquery');
var container = '#topic-viewer-div';
var svg, width, height;
var timeline_g, W, H;
var margin = {top:10, bottom:10, left:10, right:10};
var data;
function init(){
  width = $(container).width(), height = $(container).height();
  svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  timeline_g = svg.append('g').attr('transform', 'translate('+[margin.left, margin.top] +')');
  return ret;
}
function update(){
  
}
var ret = {};
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length > 0 ? (data = _, ret) : data;};
module.exports = exports = init();
