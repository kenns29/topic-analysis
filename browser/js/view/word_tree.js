var d3 = require('../load_d3');
var $ = require('jquery');
var Tooltip = require('./tooltip');
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
  var root;
  var partition;
  var svg, width, height;
  var graph_g, W, H;
  var last_id = 0;
  var duration = 700;
  var zoom;
  var tooltip;
  function init(){
    svg = d3.select(container).append('svg').attr('class', 'word-tree').attr('width', '100%').attr('height', '100%');
    graph_g = svg.append('g');
    zoom = d3.zoom().on('zoom', function(d){
      var x = d3.event.transform.x, y = d3.event.transform.y, k = d3.event.transform.k;
      graph_g.attr('transform', 'translate(' + [x, y] + ')scale('+k+')');
    });
    svg.call(zoom);
    tooltip = Tooltip().container(container).html(function(d){return d;})();
    return ret;
  }
  function update(source){
    width = $(container).width(), height = $(container).height();
    root.x0 = 0;
    root.y0 = 0;
    partition = d3.partition().size([height, width]);
    partition(root);
    re_pos_nodes_vert(root);
    re_pos_nodes_hori(root);
    var nodes = root.descendants(),
        links = root.descendants().slice(1);
    console.log('nodes', nodes);
    var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || (d.id = ++last_id);});
    var node_enter = node_sel.enter().append('g').attr('class', 'node');
    node_enter.append('text');
    var node_exit = node_sel.exit();
    if(!node_exit.empty()) node_exit.transition().duration(duration).attr('transform', function(d){
      return 'translate('+[0, 0]+')';
    });
    var node_update = node_sel.merge(node_enter);
    node_update.transition().duration(duration).attr('transform', function(d){
      return 'translate('+[d.y, d.x]+')';
    });
    node_update.select('text').attr('dominant-baseline', 'middle').attr('font-size', function(d){
      return Math.min(20, (d.x1 - d.x0)/2);
    });
    var tspan_sel = node_update.select('text').selectAll('tspan').data(function(d){return d.data.tokens;}, function(d){return d.text;});
    var tspan_enter = tspan_sel.enter().append('tspan');
    var tspan_exit = tspan_sel.exit();
    if(!tspan_exit.empty()) tspan_exit.remove();
    var tspan_update = tspan_sel.merge(tspan_enter);
    tspan_update.html(function(d, i){
      if(i === 0) return d.text; else return '&nbsp;' + d.text;
    });
    node_update.each(function(d){
      d.text_length = d3.select(this).select('text').node().getComputedTextLength();
    });
    node_update.on('mouseover', function(d){
      tooltip.show(svg.node(), d.data.tokens[0].text + ', ' + d.value);
    }).on('mousemove', function(){
      tooltip.move(svg.node());
    }).on('mouseout', function(){
      tooltip.hide();
    });

    var link_sel = graph_g.selectAll('.link').data(links, function(d){return d.id;});
    var link_enter = link_sel.enter().append('path').attr('class', 'link')
    .attr('d', function(d){
      var o = {x : 0, y:0};
      return diagonal(o, o);
    }).attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
    var link_exit = link_sel.exit();
    if(!link_exit.empty()) link_exit.remove();
    var link_update = link_sel.merge(link_enter);
    link_update.transition().duration(duration).attr('d', function(d){
      var s = {x:d.parent.x, y : d.parent.y + d.parent.text_length};
      var t = {x:d.x, y:d.y};
      return diagonal(s, t);
    });
    return ret;
  }
  var ret = {};
  ret.data = function(_){
    if(arguments.length > 0){
        data = _;
        root = d3.hierarchy(data);
        leaf_values(root);
        root.sum(function(d){return d.value;});
        root.sort(function(a, b){return b.value - a.value;});
        return ret;
    }
    return data;
  };
  ret.init = init;
  ret.update = update;
  return ret;
}
function diagonal(s, d) {
  return `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
}
function re_pos_nodes_vert(root){
  root.eachBefore(function(r){
    r.x = (r.x0 + r.x1)/2;
  });
}
function re_pos_nodes_hori(root){
  root.eachBefore(function(r){
    r.y = (r.y0 + r.y1)/2;
  });
}
function leaf_values(root){
  var leaves = root.leaves();
  var max = d3.max(leaves, function(d){return d.data.count;});
  var scale = d3.scaleSqrt().domain([0, max]).range([0, 50]);
  function to_value(d){
    var v = scale(d);
    return (v < 50) ? Math.ceil(v) : v;
  }
  leaves.forEach(function(d){
    d.data.value = d.value = to_value(d.data.count);
  });
}
