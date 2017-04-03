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
var id2topic = [];
var index2topic = [];
var id2index2token = [];
var loading = d3.select(container).select('.loading').node();
var duration = 1000;
var tooltip;
var background;
var zoom;
var display_opt = 'weight';
var selected_token;
function init(){
  width = $(container).width() - 15, height = $(container).height();
  svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%');
  background = svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'white').style('cursor', 'grab');
  graph_g = svg.append('g').attr('class', 'topic-viewer-g').attr('transform', 'translate(' + [margin.left, margin.top]+')');
  topics_g = graph_g.append('g').attr('class', 'topics-g').attr('transform', 'translate('+ [50, 0] +')')
  label_g = graph_g.append('g').attr('class', 'labels-g');
  tooltip = Tooltip().container(container).html(function(d){return d;}).init();
  zoom = d3.zoom().on('zoom', function(){
    var x = d3.event.transform.x + margin.left, y = margin.top;
    graph_g.attr('transform', 'translate('+[x, y]+')');
  });
  background.call(zoom);
  return ret;
}
function update(){
  var dat = order_topics();
  var p1 = update_topics(dat);
  var p2 = update_labels(dat);
  return Promise.all([p1, p2]);
}
function update_labels(data){
  var topic_color = require('./topic_color');
  var label_sel = label_g.selectAll('.label').data(data, function(d){return d.id;});
  var label_enter = label_sel.enter().append('g').attr('class', 'label');
  label_enter.append('rect').attr('fill', function(d){
    return topic_color(d.id);
  });
  label_sel.exit().remove();
  var label_update = label_sel.merge(label_enter);
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
  // label_update.on('mouseover', function(d){tooltip.show(svg.node(), d.id);})
  // .on('mousemove', function(){tooltip.move(svg.node());})
  // .on('mouseout', function(){tooltip.hide();});
  label_update.on('click', function(d){
    global.topic_document_viewer.scroll_to_topic(d.id);
  });
  return Promise.resolve();
}
function update_topics(data){
  var font_scale = font_scale_factory();
  var topic_sel = topics_g.selectAll('.topic').data(data, function(d){return d.id;});
  var topic_enter = topic_sel.enter().append('g').attr('class', 'topic');
  topic_sel.exit().remove();
  var topic_update = topic_sel.merge(topic_enter);
  topic_update.each(function(d){d.height = 0; d.y = 0;});
  var token_sel = topic_update.selectAll('.token').data(function(d){return d.tokens;}, function(d){return d.index;});
  var token_enter = token_sel.enter().append('g').attr('class', 'token').style('cursor', 'pointer');
  token_enter.append('text');
  token_sel.exit().remove();
  var token_update = topic_update.selectAll('.token');
  token_update.select('text').attr('font-size', function(d){
    d.font_size = d.height = font_scale(d.weight);
    var topic_data = d3.select(this.parentNode.parentNode).data()[0];
    if(topic_data.height < d.height) topic_data.height = d.height;
    return d.font_size;
  })
  .attr('fill', function(d){
    if(display_opt === 'weight') return 'blue';
    if(display_opt === 'token'){
      if(selected_token.id === d.id) return 'blue'; else return 'gray';
    }
  })
  .attr('text-anchor', 'start').attr('dominant-baseline', 'middle').text(function(d){
    return d.token;
  });
  token_update.each(function(d){d.x = 0, d.width = d3.select(this).select('text').node().getComputedTextLength();});
  data.forEach(function(d){
    if(d.index > 0){
      let pre_data = index2topic[d.index - 1];
      let pre_y = pre_data.y, pre_height = pre_data.height;
      d.y += pre_y + text_y_space + pre_height;
    }
    for(let j = 1; j < d.tokens.length; j++){
      let token = d.tokens[j];
      let pre_token = id2index2token[d.id][token.index - 1];
      let pre_x = pre_token.x, pre_width = pre_token.width;
      token.x += pre_x + text_x_space + pre_width;
    }
  });
  var s_height = svg_height(data);
  svg.attr('height','100%').style('min-height', s_height);
  var t = d3.transition().duration(duration);
  var t1 = function(){
    return new Promise(function(resolve, reject){
      topic_update.transition(t).attr('transform', function(d){
        return 'translate(' + [0, d.y] +')';
      }).on('end', resolve);
    });
  };
  var t2 = function(){
    return new Promise(function(resolve, reject){
      token_update.transition(t).attr('transform', function(d){
        var topic_height = d3.select(this.parentNode).data()[0].height;
        return 'translate(' + [d.x, topic_height/2] +')';
      }).on('end', resolve);
    });
  };
  token_update.on('click', function(d){
    if(display_opt === 'weight') {
      selected_token = d;
      display_opt = 'token';
    }
    else if(display_opt === 'token' && selected_token !== d){
      selected_token = d;
    }
    else if(display_opt === 'token'){
      display_opt = 'weight';
    }
    update();
  });
  token_update.on('mouseover', function(d){tooltip.show(svg.node(), d.token + ': '+ d.weight);})
  .on('mousemove', function(){tooltip.move(svg.node());})
  .on('mouseout', function(){tooltip.hide();});
  return Promise.all([t1(), t2()]);
}
function total_topic_height(data){
  var total_height = 0;
  data.forEach(function(d, i){
    if(i === 0) total_height += d.height;
    else total_height += text_y_space + d.height;
  });
  return total_height;
}
function svg_height(data){
  var total_height = total_topic_height(data);
  return margin.top + total_height + margin.bottom;
}
function font_scale_factory(){
  var extent = [Infinity, -Infinity];
  data.forEach(function(t){
    t.tokens.forEach(function(token){
      if(extent[0] > token.weight) extent[0] = token.weight;
      if(extent[1] < token.weight) extent[1] = token.weight;
    });
  });
  return d3.scaleSqrt().domain(extent).range([10,50]);
}

function order_topics(){
  order_all_tokens();
  if(display_opt === 'weight') return order_topics_by_weight();
  else if(display_opt === 'token') return order_topics_by_token(selected_token);
}
function order_topics_by_weight(){
  data.sort(function(a, b){
    return b.tokens[0].weight - a.tokens[0].weight;
  });
  index2topic = Array(data.length);
  data.forEach(function(d, i){
    d.index = i;
    index2topic[i] = d;
  });
  return data;
}
function order_topics_by_token(token){
  var id2weight = [];
  data.forEach(function(d){
    var t_idx = d.tokens.length;
    for(let i = 0; i < d.tokens.length; i++){
      if(d.tokens[i].token === token.token) {t_idx = i; break;}
    }
    id2weight[d.id] = t_idx;
  });
  data.sort(function(a, b){
    return id2weight[a.id] - id2weight[b.id];
  });
  index2topic = Array(data.length);
  data.forEach(function(d, i){
    d.index = i;
    index2topic[i] = d;
  });
  return data.filter(function(d){return id2weight[d.id] < d.tokens.length;});
}
function order_tokens(t){
  // t.topic.sort(function(a, b){
  //   return b.weight - a.weight;
  // });
  if(!id2index2token[t.id]) id2index2token[t.id] = [];
  t.tokens.forEach(function(token, i){
    token.index = i;
    id2index2token[t.id][i] = token;
  });
}

function order_all_tokens(){
  id2index2token = [];
  data.forEach(function(t){order_tokens(t);});
}
var ret = {};
ret.init = init;
ret.update = update;
ret.data = function(_){
  if(arguments.length > 0){
    data = _; id2topic = [];
    data.forEach(function(d){id2topic[d.id] = d;});
    return ret;
  } else return data;
};
ret.loading = function(){return loading;};
ret.duration = function(){return duration;};
ret.display_opt = function(_){return arguments.length > 0?(display_opt=_, ret):display_opt;};
module.exports = init();
