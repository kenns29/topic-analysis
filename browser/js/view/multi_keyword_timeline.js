var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = exports = function(){
  var container = '#keyword-timeline-view-div';
  var svg, width, height;
  var timeline_g, W, H;
  var margin = {top:20, bottom:10, left:10, right:10};
  var data = [];
  var id2data = [];
  var timeline_height = 30;
  var timeline_y_space = 5;
  var min_year = 1979;
  var max_year = 1989;
  var x_scale;
  function init(){
    width = $(container).width(), height = $(container).height();
    W = width - margin.left - margin.right - 50;
    H = height - margin.top - margin.bottom;
    svg = d3.select(container).attr('class', 'keyword-timeline')
    .append('svg').attr('width', width).attr('height', height);
    timeline_g = svg.append('g').attr('transform','translate('+[margin.left, margin.top]+')');
    x_scale = d3.scaleLinear().domain([min_year, max_year]).range([0, W]);
    return ret;
  }
  function update(){
    var timeline_sel = timeline_g.selectAll('.timeline').data(data, function(d){return d.id;});
    var timeline_enter = timeline_sel.enter().append('g').attr('class', 'timeline');
    var label_enter = timeline_enter.append('text').attr('transform', 'translate('+[45, 0]+')')
    .attr('dominant-baseline', 'middle').attr('text-anchor', 'end').attr('font-size',  10)
    .text(function(d){return d.id});
    var area_enter = timeline_enter.append('g').attr('class', 'area').attr('transform', 'translate(' +[50, 0]+ ')');
    area_enter.append('path');
    timeline_sel.exit().remove();
    var timeline_update = timeline_g.selectAll('.timeline');
    timeline_update.transition().duration(500)
    .attr('transform', function(d){
      var x = 0, y = d.index * (timeline_height + timeline_y_space);
      return 'translate('+[x, y]+')';
    });
    timeline_update.select('.area').each(update_line);
    return ret;
  }
  function update_line(d, i){
    var y_extent = d3.extent(d.data, function(d){return d.count;});
    var y_scale = d3.scaleLinear().domain(y_extent).range([0, timeline_height/2]);
    var area_fun = d3.area().x(function(d){return x_scale(d.year);})
    .y(function(){return 0;})
    .y0(function(d){return -y_scale(d.count);})
    .y1(function(d){return y_scale(d.count);});
    d3.select(this).select('path').transition().duration(500).attr('d', function(d){
      return area_fun(d.data);
    }).attr('fill', 'blue').attr('stroke', 'black').attr('stroke-width', 1);
  }
  function add_timeline(line_data){
    if(!id2data[line_data.id]){
      line_data.index = data.length;
      id2data[line_data.id] = line_data;
      data.push(line_data);
    }
    return ret;
  }
  function remove_timeline(id){
    var i = data.length;
    while(i >= 0){
      if(data[i].id === id){
        data.splice(i, 1);
        for(let j = i; j < data.length;j++) data[j].index = j;
        break;
      }
      --i;
    }
    return ret;
  }
  var ret = {};
  ret.data = function(_){
    if(arguments.length > 0){
      id2data = [];
      data = _;
      data.forEach(function(d, i){id2data[d.id] = d; d.index = i;});
      return ret;
    } else return data;
  };
  ret.init = init;
  ret.update = update;
  ret.add_timeline = add_timeline;
  ret.remove_timeline = remove_timeline;
  return ret;
};
