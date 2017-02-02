var d3 = require('../load_d3');
var $ = require('jquery');
var Tooltip = require('./tooltip');
var container = '#topic-viewer-div';
var svg, width, height;
var graph_g, W, H;
var topics_g;
var label_g;
var margin = {top:10, left:10,bottom:10,right:10};
var data = [];
var text_x_space = 3;
var text_y_space = 3;
var index_to_topic = [];
var index_to_token = [];
var loading = d3.select(container).select('.loading').node();
var duration = 1000;
var tooltip;
function init(){
  width = $(container).width(), height = $(container).height();
  svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  graph_g = svg.append('g').attr('class', 'topic-viewer-g').attr('transform', 'translate(' + [margin.left, margin.top]+')');
  topics_g = graph_g.append('g').attr('class', 'topics-g').attr('transform', 'translate('+ [50, 0] +')')
  label_g = graph_g.append('g').attr('class', 'labels-g');
  tooltip = Tooltip().container(container).html(function(d){return d;}).init();
  return ret;
}
function update(){
  order_topics();
  var p1 = update_topics();
  var p2 = update_labels();
  return Promise.all([p1, p2]);
}
function update_labels(){
  var topic_color = require('./topic_color');
  var label_sel = label_g.selectAll('.label').data(data, function(d){return d.index;});
  var label_enter = label_sel.enter().append('g').attr('class', 'label');
  label_enter.append('rect').attr('fill', function(d){
    return topic_color(d.id);
  });
  label_sel.exit().remove();
  var label_update = label_g.selectAll('.label');
  label_update.transition().duration(duration).attr('transform', function(d){
    return 'translate(' + [0, d.y + d.height/2] + ')'
  });
  label_update.select('rect').each(function(d, i){
    var rect_h = d.height > 20 ? 20 : d.height,
        rect_w = 40;
    d3.select(this).attr('fill', function(d){return topic_color(d.id);});
    d3.select(this).transition().duration(duration).attr('width', rect_w).attr('height', rect_h)
    .attr('y', -rect_h/2);
  });
  label_update.on('mouseover', function(d){tooltip.show(svg.node(), d.id);})
  .on('mousemove', function(){tooltip.move(svg.node());})
  .on('mouseout', function(){tooltip.hide();});
  label_update.on('click', function(d){
    var nodes = global.document_viewer.documents()._groups[0];
    var top = 0;
    var documents_container = global.document_viewer.container();
    if(nodes){
      for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        let dat = node.__data__;
        if(Number(dat.topic) == Number(d.id)){
          top = $(node).position().top + $(documents_container).scrollTop();
          break;
        }
      }
    }
    $(documents_container).animate({
      scrollTop : top
    }, 1000);
  });
  return Promise.resolve();
}
function update_topics(){
  var font_scale = font_scale_factory();
  var topic_sel = topics_g.selectAll('.topic').data(data, function(d){return d.index;});
  var topic_enter = topic_sel.enter().append('g').attr('class', 'topic');
  topic_sel.exit().remove();
  var topic_update = topics_g.selectAll('.topic');
  topic_update.each(function(d){d.height = 0; d.y = 0;});
  var token_sel = topic_update.selectAll('.token').data(function(d){return d.topic;}, function(d){return d.index;});
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
  topic_update.each(function(d){
    if(d.index > 0){
      let pre_data = index_to_topic[d.index - 1];
      let pre_y = pre_data.y, pre_height = pre_data.height;
      d.y += pre_y + text_y_space + pre_height;
    }
  });
  token_update.each(function(d){d.x = 0;});
  token_update.each(function(d, i){
    d.width = d3.select(this).select('text').node().getComputedTextLength();
    if(d.index > 0){
      let topic_data = d3.select(this.parentNode).data()[0];
      let pre_data = index_to_token[topic_data.index][d.index - 1];
      let pre_x = pre_data.x, pre_width = pre_data.width;
      d.x += pre_x + text_x_space + pre_width;
    }
  });
  var t1 = function(){
    return new Promise(function(resolve, reject){
      topic_update.transition().duration(duration).attr('transform', function(d){
        return 'translate(' + [0, d.y] +')';
      }).on('end', resolve);
    });
  };
  var t2 = function(){
    return new Promise(function(resolve, reject){
      token_update.transition().duration(duration).attr('transform', function(d){
        var topic_height = d3.select(this.parentNode).data()[0].height;
        return 'translate(' + [d.x, topic_height/2] +')';
      }).on('end', resolve);
    });
  };
  return Promise.all([t1(), t2()]);
}
function font_scale_factory(){
  var extent = [Infinity, -Infinity];
  data.forEach(function(t){
    t.topic.forEach(function(token){
      if(extent[0] > token.weight) extent[0] = token.weight;
      if(extent[1] < token.weight) extent[1] = token.weight;
    });
  });
  return d3.scaleSqrt().domain(extent).range([10,50]);
}
function order_topics(){
  data.sort(function(a, b){
    return b.topic[0].weight - a.topic[0].weight;
  });
  index_to_topic = Array(data.length);
  index_to_token = [];
  data.forEach(function(d, i){
    d.index = i;
    index_to_topic[i] = d;
    order_tokens(d);
  });
  return data;
}
function order_tokens(t){
  t.topic.sort(function(a, b){
    return b.weight - a.weight;
  });
  if(!index_to_token[t.index]) index_to_token[t.index] = [];
  t.topic.forEach(function(token, i){
    token.index = i;
    index_to_token[t.index][i] = token;
  });
}

var ret = {};
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length > 0 ? (data = _, ret) : data;};
ret.loading = function(){return loading;};
ret.duration = function(){return duration;};
module.exports = init();
