var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = exports = function(){
  var container = '#keyword-timeline-div';
  var svg, width, height;
  var timeline_g, W, H;
  var margin = {top:10, bottom:10, left:10, right:10};
  var data;
  function init(){
    width = $(container).width(), height = $(container).height();
    svg = d3.select(container).attr('class', 'keyword-timeline')
    .append('svg').attr('width', width).attr('height', height);
    timeline_g.append('g').attr('translate('+[margin.left, margin.top]+')');
    return ret;
  }
  function update(){
    var timeline_sel = timeline_g.selectAll('.timeline').data(data, function(d){return d.id;});
    var timeline_enter = timeline_sel.enter().append('g').attr('class', 'timeline');
    timeline_sel.exit().remove();
    var timeline_update = timeline_g.selectAll('.timeline');
  }
  var ret = {};
  
  ret.init = init;
  ret.update = update;
  return ret;
};
