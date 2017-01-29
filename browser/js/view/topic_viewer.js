var d3 = require('../load_d3');
var $ = require('jquery');
var container = '#topic-viewer-div';
var svg, width, height;
var graph_g, W, H;
var margin = {top:10, left:10,bottom:10,right:10};
var data;
var text_x_space = 3;
var text_y_space = 3;
function init(){
  width = $(container).width(), height = $(container).height();
  svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  graph_g = svg.append('g').attr('class', 'topic-viewer-g').attr('transform', 'translate(' + [margin.left, margin.top]+')');
  return ret;
}
function update(){
  var font_scale = font_scale_factory();
  var topic_sel = graph_g.selectAll('.topic').data(data);
  var topic_enter = topic_sel.enter().append('g').attr('class', 'topic');
  topic_sel.exit().remove();
  var topic_update = graph_g.selectAll('.topic');
  topic_update.each(function(d){d.height = 0; d.y = 0;});
  var token_sel = topic_update.selectAll('.token').data(function(d){return d;}, function(d){return d.id;});
  var token_enter = token_sel.enter().append('g').attr('class', 'token');
  token_enter.append('text');
  token_sel.exit().remove();
  var token_update = topic_update.selectAll('.token');
  token_update.select('text').attr('font-size', function(d){
    d.font_size = d.height = font_scale(d.weight);
    var topic_data = d3.select(this.parentNode.parentNode).data()[0];
    if(topic_data.height < d.height) topic_data.height = d.height;
    return d.font_size;
  })
  .attr('fill', 'blue')
  .attr('text-anchor', 'start').attr('dominant-baseline', 'middle').text(function(d){
    return d.token;
  });
  topic_update.each(function(d, i){
    if(i > 0){
      let pre_data = topic_update.data()[i-1];
      let pre_y = pre_data.y, pre_height = pre_data.height;
      d.y += pre_y + text_y_space + pre_height;
    }
  });
  token_update.each(function(d){d.x = 0;});
  token_update.each(function(d, i){
    d.width = d3.select(this).select('text').node().getComputedTextLength();
    if(i > 0){
      let pre_data = d3.select(this.parentNode).data()[0][i-1];
      let pre_x = pre_data.x, pre_width = pre_data.width;
      d.x += pre_x + text_x_space + pre_width;
    }
  });
  topic_update.attr('transform', function(d, i){
    return 'translate(' + [0, d.y] +')';
  });
  token_update.attr('transform', function(d, i){
    var topic_height = d3.select(this.parentNode).data()[0].height;
    return 'translate(' + [d.x, topic_height/2] +')';
  });
  return ret;
}
function font_scale_factory(){
  var extent = [Infinity, -Infinity];
  data.forEach(function(topic, i){
    topic.forEach(function(token, i){
      if(extent[0] > token.weight) extent[0] = token.weight;
      if(extent[1] < token.weight) extent[1] = token.weight;
    });
  });
  return d3.scaleSqrt().domain(extent).range([10,50]);
}
var ret = {};
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length > 0 ? (data = _, ret) : data;};
module.exports = init();
