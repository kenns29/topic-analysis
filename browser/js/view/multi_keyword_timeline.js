var d3 = require('../load_d3');
var $ = require('jquery');
var Tooltip = require('./tooltip');
var LoadPapers = require('../load/load_papers');
var LoadPanels = require('../load/load_panels');
var KeywordSelect = require('../UI/keyword_select');
var UpdateKeywordDocumentViewer = require('../control/update_keyword_document_viewer');
module.exports = exports = function(){
  var container = '#keyword-timeline-view-div';
  var svg, width, height;
  var timeline_g, W, H;
  var margin = {top:20, bottom:10, left:10, right:20};
  var data = [];
  var id2data = [];
  var timeline_height = 30;
  var timeline_y_space = 7;
  var min_year = 1979;
  var max_year = 1989;
  var y_scale;
  var x_scale;
  var x_axis;
  var x_axis_g;
  var tooltip;
  var timeline_x_offset = 50;
  var brushes = brushes_factory();
  var loading;
  function init(){
    width = $(container).width(), height = $(container).height();
    W = width - margin.left - margin.right - timeline_x_offset;
    H = height - margin.top - margin.bottom;
    svg = d3.select(container).attr('class', 'keyword-timeline')
    .append('svg').attr('width', width).attr('height', height);
    timeline_g = svg.append('g').attr('transform','translate('+[margin.left, margin.top]+')');
    x_scale = d3.scaleLinear().domain([min_year, max_year]).range([0, W]);
    x_axis = d3.axisBottom().scale(x_scale).ticks(max_year - min_year + 1);
    x_axis.tickFormat(d3.format('d'));
    x_axis_g = svg.append('g').attr('class', 'x-axis').attr('transform', 'translate('+[margin.left + timeline_x_offset, 0]+')');
    tooltip = Tooltip().container(container).font_size('15px')();
    loading = d3.select(container).select('.loading').node();
    return ret;
  }
  function update_y_scale(){
    var extent = [Infinity, -Infinity];
    data.forEach(function(d){
      d.data.forEach(function(obj){
          if(extent[0] > obj.count) extent[0] = obj.count;
          if(extent[1] < obj.count) extent[1] = obj.count;
      });
    });
    y_scale = d3.scaleSqrt().domain(extent).range([0, timeline_height/2]);
  }
  function update(){
    update_y_scale();
    var timeline_sel = timeline_g.selectAll('.timeline').data(data, function(d){return d.id;});
    var timeline_enter = timeline_sel.enter().append('g').attr('class', 'timeline');
    var label_enter = timeline_enter.append('text').attr('transform', 'translate('+[timeline_x_offset - 5, timeline_height/2]+')')
    .attr('dominant-baseline', 'middle').attr('text-anchor', 'end').attr('font-size',  10).style('cursor', 'pointer')
    .text(function(d){return d.id});
    var area_enter = timeline_enter.append('g').attr('class', 'area').attr('transform', 'translate(' +[timeline_x_offset, 0]+ ')');
    area_enter.append('rect').attr('width', W).attr('height', timeline_height).attr('fill','white');
    area_enter.append('path');
    timeline_sel.exit().remove();
    var timeline_update = timeline_g.selectAll('.timeline');
    timeline_update.transition().duration(500)
    .attr('transform', function(d){
      var x = 0, y = d.index * (timeline_height + timeline_y_space);
      return 'translate('+[x, y]+')';
    });
    timeline_update.select('.area').each(update_line);
    timeline_update.select('.area').call(area_mouseover);
    x_axis_g.call(x_axis);
    x_axis_g.transition().duration(500).attr('transform', 'translate(' + [
      margin.left + 50,
      margin.top + data.length * (timeline_height + timeline_y_space) + 5
    ]+')');
    label_enter.on('click', function(d, i){
      remove_timeline(d.id);
      update();
    });
    if(brushes.is_activated())brushes.activate();
    return ret;
  }
  function area_mouseover(element){
    element.on('mouseover', function(d){
      var v = value.call(this, d);
      tooltip.show(svg.node(), 'year: ' + v.year + ', count: ' + v.value);
    }).on('mousemove', function(d){
      var v = value.call(this, d);
      tooltip.move(svg.node(), 'year: ' + v.year + ', count: ' + v.value);
    }).on('mouseout', function(d){tooltip.hide();});
    function value(d){
      var x = d3.mouse(this)[0];
      var year = Math.floor(x_scale.invert(x));
      var line_data = d3.select(this).data()[0];
      let values = line_data.data;
      let value = 0;
      for(let i = 0; i < values.length; i++){
        let v = values[i];
        if(Number(v.year) === Number(year)) {value = v.count; break;}
      }
      return {year : year, value : value};
    }
  }
  function update_line(d, i){
    // var y_extent = d3.extent(d.data, function(d){return d.count;});
    // var y_scale = d3.scaleLinear().domain(y_extent).range([0, timeline_height/2]);
    var area_fun = d3.area().x(function(d){return x_scale(d.year);})
    .y(function(){return timeline_height/2;})
    .y0(function(d){return timeline_height/2+y_scale(d.count);})
    .y1(function(d){return timeline_height/2-y_scale(d.count);}).curve(d3.curveCardinal);
    d3.select(this).select('path').transition().duration(500).attr('d', function(d){
      return area_fun(d.data);
    }).attr('fill', 'lightpink').attr('stroke', 'black').attr('stroke-width', 1);
  }
  function add_timeline(line_data){
    if(!id2data[line_data.id]){
      line_data.index = data.length;
      id2data[line_data.id] = line_data;
      data.push(line_data);
      brushes.add(line_data.id);
    }
    if(brushes.is_activated())
      UpdateKeywordDocumentViewer().keywords(data.map(function(d){return d.id;}))
      .update_domain(brushes.domain());
    // KeywordSelect.disable_opts();
    return ret;
  }
  function replace_timeline(line_data){
    if(id2data[line_data.id]){
      let index = id2data[line_data.id].index;
      line_data.index = index;
      data[index] = line_data;
      id2data[line_data.id] = line_data;
    }
  }
  function remove_timeline(id){
    var i = data.length - 1;
    while(i >= 0){
      if(data[i].id === id){
        data.splice(i, 1);
        delete id2data[id];
        for(let j = i; j < data.length;j++) data[j].index = j;
        break;
      }
      --i;
    }
    brushes.remove(id);
    if(brushes.is_activated())
      UpdateKeywordDocumentViewer().keywords(data.map(function(d){return d.id;}))
      .update_domain(brushes.domain());
    // if(data.length === 0) KeywordSelect.enable_opts();
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
  ret.replace_timeline = replace_timeline;
  ret.remove_timeline = remove_timeline;
  ret.activate_brushes = function(){brushes.activate();};
  ret.deactivate_brushes = function(){brushes.deactivate();};
  ret.loading = function(){return loading;};
  ret.brushes = function(){return brushes;};
  return ret;

  function brushes_factory(){
    var id2brush = [];
    var activated = false;
    var domain = null;
    var extent = null;
    function activate_one_brush(id){
      timeline_g.selectAll('.timeline').select('.area').filter(function(d){return d.id === id;}).each(function(d){
        var brush_g = d3.select(this).select('.brush');
        if(brush_g.empty()) brush_g = d3.select(this).append('g').attr('class', 'brush');
        brush_g.call(id2brush[d.id]);
        if(extent) brush_g.call(id2brush[d.id].move, extent);
      });
    }
    function activate_brush(){
      timeline_g.selectAll('.timeline').select('.area').each(function(d){
        var brush_g = d3.select(this).select('.brush');
        if(brush_g.empty()) brush_g = d3.select(this).append('g').attr('class', 'brush');
        brush_g.call(id2brush[d.id]);
        if(extent) brush_g.call(id2brush[d.id].move, extent);
      });
      activated = true;
    }
    function deactivate_brush(){
      timeline_g.selectAll('.timeline').select('.area').select('.brush').remove();
      activated = false;
    }
    function add_brush(id){
      id2brush[id] = brush_maker(id);
      return ret_brush;
    }
    function remove_brush(id){
      delete id2brush[id];
      return ret_brush;
    }
    function brush_maker(id){
      var brush = d3.brushX().extent([[0, -3], [W, timeline_height+3]]);
      brush.on('brush', function(){
        if(!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type === "brush") return;
        if(d3.event.selection){
          let domain = d3.event.selection.map(function(d){return Math.round(x_scale.invert(d));});
          let extent = domain.map(x_scale);
          d3.select(this).call(d3.event.target.move, extent);
          timeline_g.selectAll('.timeline').select('.area').select('.brush').call(d3.event.target.move, extent);
        }
      }).on('end', function(){
        if(!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type === "brush") return;
        if(d3.event.selection){
          domain = d3.event.selection.map(function(d){return Math.round(x_scale.invert(d));});
          extent = domain.map(x_scale);
          UpdateKeywordDocumentViewer().keywords(data.map(function(d){return d.id;}))
          .update_domain(domain);
        }
      });
      return brush;
    }
    var ret_brush = {};
    ret_brush.activate = activate_brush;
    ret_brush.activate_one = activate_one_brush;
    ret_brush.deactivate = deactivate_brush;
    ret_brush.add = add_brush;
    ret_brush.remove = remove_brush;
    ret_brush.is_activated = function(){return activated;};
    ret_brush.domain = function(){return domain;};
    ret_brush.extent = function(){return extent;};
    return ret_brush;
  }
};
