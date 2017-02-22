var d3 = require('../load_d3');
var $ = require('jquery');
var Tooltip = require('./tooltip');

module.exports = exports = word_tree;

var text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]);
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
  var partition_height;
  var node_x_space = 40;

  var hierarchy_forward;
  var hierarchy_reverse;
  var loading;
  function init(){
    svg = d3.select(container).append('svg').attr('class', 'word-tree').attr('width', '100%').attr('height', '100%');
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
    update_tree(hierarchy_forward, null, null);
    // update_tree(hierarchy_reverse, null, true);
  }
  function update_tree(hierarchy, source, reverse){
    var root = hierarchy.root();
    var nodes = root.descendants(),
        links = root.descendants().slice(1);
    //Entering the necessary nodes and append texts, and compute the font and text length for each node
    var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || (d.id = ++last_id);});
    var node_enter = node_sel.enter().append('g').attr('class', 'node');
    node_enter.append('text');
    var node_exit = node_sel.exit();
    if(!node_exit.empty()) node_exit.transition().duration(duration).attr('transform', function(d){
      return 'translate('+[0, 0]+')';
    });
    var node_update = node_sel.merge(node_enter);
    node_update.select('text').attr('dominant-baseline', 'middle').attr('font-size', function(d){
      return hierarchy.count2font(d.data.count);
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

    //update the layout
    width = $(container).width(), height = $(container).height();
    var layout_height = hierarchy.height() > height ? hierarchy.height() : height;
    var partition = Partition().hierarchy(hierarchy).reverse(reverse).height(height).width(width).update();
    partition.move_y(width/2);

    // partition = d3.partition().size([layout_height, width/2]);
    // partition(root);
    // node_x(root);
    // node_y(root);
    // var nodes = root.descendants(),
    //     links = root.descendants().slice(1);
    // var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || (d.id = ++last_id);});
    // var node_enter = node_sel.enter().append('g').attr('class', 'node');
    // node_enter.append('text');
    // var node_exit = node_sel.exit();
    // if(!node_exit.empty()) node_exit.transition().duration(duration).attr('transform', function(d){
    //   return 'translate('+[0, 0]+')';
    // });
    // var node_update = node_sel.merge(node_enter);
    // node_update.select('text').attr('dominant-baseline', 'middle').attr('font-size', function(d){
    //   return hierarchy.count2font(d.data.count);
    // });
    // var tspan_sel = node_update.select('text').selectAll('tspan').data(function(d){return d.data.tokens;}, function(d){return d.text;});
    // var tspan_enter = tspan_sel.enter().append('tspan');
    // var tspan_exit = tspan_sel.exit();
    // if(!tspan_exit.empty()) tspan_exit.remove();
    // var tspan_update = tspan_sel.merge(tspan_enter);
    // tspan_update.html(function(d, i){
    //   if(i === 0) return d.text; else return '&nbsp;' + d.text;
    // });
    // node_update.each(function(d){
    //   d.text_length = d3.select(this).select('text').node().getComputedTextLength();
    // });
    // node_hori_adjust(root, node_x_space);
    node_update.transition().duration(duration).attr('transform', function(d){
      return 'translate('+[d.y, d.x]+')';
    });
    node_update.on('mouseover', function(d){
      tooltip.show(svg.node(), d.data.tokens[0].text + ', value ' + d.value + ', count ' + d.data.count + ', font ' + hierarchy.count2font(d.data.count));
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
      var s = {x:d.parent.x, y : d.parent.y + d.parent.text_length + 5};
      var t = {x:d.x, y:d.y - 5};
      return diagonal(s, t);
    });
    return ret;
  }
  var ret = {};
  ret.data = function(_data, _reverse){
    if(arguments.length > 0){
        data = _data;
        if(!_reverse) hierarchy_forward = Hierarchy().make(data);
        else hierarchy_reverse = Hierarchy().make(data);
        return ret;
    }
    return data;
  };
  ret.init = init;
  ret.update = update;
  ret.loading = function(){return loading;};
  return ret;
}
function diagonal(s, d) {
  return `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
}
function node_x(root){
  root.eachBefore(function(r){
    r.x = (r.x0 + r.x1)/2;
  });
}
function node_y(root){
  root.eachBefore(function(r){
    r.y = r.y0;
  });
}
function node_hori_adjust(root, node_x_space){
  root.each(function(r){
    if(r.children && r.children.length > 0){
      var end_y = r.text_length + r.y;
      r.children.forEach(function(child){
        let diff = child.y - end_y;
        if(diff < node_x_space){
          child.y += node_x_space - diff;
        }
      });
    }
  });
}
function Partition(){
  var hierarchy;
  var reverse;
  var height, width;
  var partition;
  var node_y_space = 40;
  function init(){
    var root = hierarchy.root();
    root.x0 = 0;
    root.y0 = 0;
    root.x1 = height;
    root.y1 = 20;
    partition = d3.partition().size([height, width]);
    return ret;
  }
  function init_x(root){
    root.eachBefore(function(r){
      r.x = (r.x0 + r.x1)/2;
    });
  }
  function init_y(root){
    root.eachBefore(function(r){
      r.y = r.y0;
    });
  }
  function adjust_y(root){
    root.each(function(r){
      var offset = reverse ? -r.text_length : r.text_length;
      if(r.children && r.children.length > 0){
        let end_y = offset + r.y;
        r.children.forEach(function(child){
          child.y = end_y + node_y_space;
        });
      }
    });
    return ret;
  }
  function move_y(root, y){
    root.y = y;
    adjust_y(root);
    return ret;
  }
  function update(){
    init();
    var root = hierarchy.root();
    partition(root);init_x(root);init_y(root);
    return ret;
  }
  function ret(){return update();}
  ret.update = update;
  ret.hierarchy = function(_){return arguments.length > 0 ?(hierarchy =_, ret) : hierarchy;};
  ret.reverse = function(_){return arguments.length > 0 ?(reverse =_, ret) : reverse;};
  ret.height = function(_){return arguments.length > 0 ?(height =_, ret) : height;};
  ret.width = function(_){return arguments.length > 0 ?(width =_, ret) : width;};
  ret.adjust_y = function(){return adjust_y(hierarchy.root());};
  ret.move_y = function(y){return move_y(hierarchy.root(), y);}
  return ret;
}
function Hierarchy(){
  var data, root, height, count2font, count_extent;
  var reverse;
  function make(_){
    if(arguments.length > 0) data = _;
    root = d3.hierarchy(data);
    count_extent = d3.extent(root.descendants(), function(d){return d.data.count;});
    count2font = count2font_factory(count_extent);
    var leave = leaf_values(root, count2font);
    height = height_by_leave(leave);
    root.sum(function(d){return d.value;});
    root.sort(function(a, b){return b.data.count - a.data.count;});
    ret.count2font = count2font;
    return ret;
  }
  function ret(_){return make(_);}
  ret.make = make;
  ret.data = function(_){return arguments.length > 0 ?(data =_, ret) : data;};
  ret.root = function(_){return arguments.length > 0 ?(root =_, ret) : root;};
  ret.height = function(_){return arguments.length > 0 ?(height =_, ret) : height;};
  ret.count_extent = function(_){return arguments.length > 0 ?(count_extent =_, ret) : count_extent;};
  return ret;
}
function count2font_factory(extent){
  var scale = d3.scaleLinear().domain(extent).range([0, 50]);
  return function(count){
    var v = scale(count);
    return text_scale(v);
  };
}
function leaf_values(root, count2font){
  var leaves = root.leaves();
  leaves.forEach(function(d){
    d.data.value = d.value = count2font(d.data.count);
  });
  return leaves;
}
function height_by_leave(leave){
  var padding = 10;
  var sum = d3.sum(leave, function(d){return d.data.value;});
  return sum;
}
