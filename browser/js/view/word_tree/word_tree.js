var d3 = require('../../load_d3');
var $ = require('jquery');
var Tooltip = require('../tooltip');
var Hierarchy = require('./hierarchy');
var Partition = require('./partition');
var count2font_factory = require('./count2font');
var SIZE = require('./size');
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
width = SIZE[0], height = SIZE[1];
function word_tree(){
  var container = "#keyword-tree-view-div";
  var data;
  var root;
  var partition;
  var svg;
  var graph_g, W, H;
  var last_id = 0;
  var duration = 700;
  var zoom;
  var tooltip;
  var partition_height;
  var node_x_space = 40;

  var hierarchy_forward;
  var hierarchy_reverse;
  var partition_forward;
  var partition_reverse;
  var loading;
  function init(){
    svg = d3.select(container).append('svg')
    .attr('class', 'word-tree').attr('width', '100%').attr('height', '100%')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", '0 0 '+width+' '+height);
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
    svg.call(zoom.transform, d3.zoomIdentity);
    return update_all();
  }

  function update_all(source){
    var root_forward = hierarchy_forward.root();
    var root_reverse = hierarchy_reverse.root();
    var nodes_forward = root_forward.descendants();
    var nodes_reverse = root_reverse.descendants();
    var links_forward = root_forward.descendants().slice(1);
    var links_reverse = root_reverse.descendants().slice(1);
    var nodes = nodes_forward.concat(links_reverse);
    var links = links_forward.concat(links_reverse);

    //Entering the necessary nodes and append texts, and compute the font and text length for each node
    var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || (d.id = ++last_id);});
    var node_enter = node_sel.enter().append('g').attr('class', 'node').style('cursor', 'pointer');
    node_enter.append('text');
    var node_exit = node_sel.exit();
    if(!node_exit.empty()) node_exit.transition().duration(duration).attr('transform', function(d){
      return 'translate('+ (source ? :[source.y, source.x] : [0, 0]) +')';
    }).remove();
    var node_update = node_sel.merge(node_enter);
    node_update.select('text').attr('dominant-baseline', 'middle').attr('font-size', function(d){return d.font;})
    .attr('text-anchor', function(d){return d.reverse ? 'end' : 'start';});
    node_update.select('text').call(generate_tspan, function(d){return d.data.tokens;});
    node_update.each(function(d){
      d.data.text_length = d.text_length = d3.select(this).select('text').node().getComputedTextLength();
    });

    //update the layout
    // width = $(container).width(), height = $(container).height();
    var layout_height_forward = hierarchy_forward.height() > height ? hierarchy_forward.height() : height;
    var layout_height_reverse = hierarchy_reverse.height() > height ? hierarchy_reverse.height() : height;
    var partition_forward = Partition().hierarchy(hierarchy_forward).reverse(false).height(layout_height_forward).width(width/2).update();
    partition_forward.move_y(width/2);
    var partition_reverse = Partition().hierarchy(hierarchy_reverse).reverse(true).height(layout_height_reverse).width(width/2).update();
    root_reverse.text_length = root_forward.text_length;
    partition_reverse.move_y(root_forward.y1);
    partition_reverse.move_x(root_forward.x);

    //update nodes
    node_update.transition().duration(duration).attr('transform', function(d){
      return 'translate('+[d.y, d.x]+')';
    });
    node_update.call(mouseover);
    node_update.on('click', click);
    //update links
    var link_sel = graph_g.selectAll('.link').data(links, function(d){return d.id;});
    var link_enter = link_sel.enter().append('path').attr('class', 'link')
    .attr('d', function(d){
      var o = source ? {x:source.x,y:source.y}:{x:0,y:0};
      return diagonal(o, o);
    }).attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5);
    var link_exit = link_sel.exit();
    if(!link_exit.empty()) link_exit.remove();
    var link_update = link_sel.merge(link_enter);
    link_update.transition().duration(duration).attr('d', function(d){
      var sy_offset = d.reverse ? -(d.parent.text_length + 5) : (d.parent.text_length + 5);
      var ty_offset = d.reverse ? 5 : -5;
      var s = {x:d.parent.x, y : d.parent.y + sy_offset};
      var t = {x:d.x, y:d.y + ty_offset};
      return diagonal(s, t);
    });
    return ret;
  }
  var ret = {};
  ret.data = function(_data, _reverse){
    if(arguments.length > 0){
        data = _data;
        if(!_reverse) hierarchy_forward = Hierarchy().reverse(false).make(data);
        else hierarchy_reverse = Hierarchy().reverse(true).make(data);
        return ret;
    }
    return data;
  };
  ret.init = init;
  ret.update = update;
  ret.loading = function(){return loading;};
  return ret;
  function generate_tspan(element, d){
    var tspan_sel = element.selectAll('tspan').data(d, function(d){return d.text;});
    var tspan_enter = tspan_sel.enter().append('tspan');
    var tspan_exit = tspan_sel.exit();
    if(!tspan_exit.empty()) tspan_exit.remove();
    var tspan_update = tspan_sel.merge(tspan_enter);
    tspan_update.html(function(d, i){
      if(i === 0) return d.text; else return '&nbsp;' + d.text;
    });
    return tspan_update;
  }
  function click(d){
    var node = d; var r;
    if(d === (r = hierarchy_forward.root())){
      op(r, r);
      op(r = hierarchy_reverse.root(), r);
      update_all();
    } else {
      r = d.reverse ? hierarchy_reverse.root() : hierarchy_forward.root();
      op(d, r);
      update_all();
    }
    function op(node, root){
      //if the node was collapsed before
      if(node._collapsed){
        expand_sibling(node);
        expand_value(node);
        expand_font(node, root);
      } else if(node.parent && !node._collapsed){
        collapse_sibling(node);
        collapse_value(node, root);
        collapse_font(node, root);
      }
      if(!node.reverse) hierarchy_forward.adjust();
      else hierarchy_reverse.adjust();
    }
  }

  function mouseover(element){
    element.on('mouseover', function(d){
      // var content = d.data.tokens[0].text + ', value ' + d.value + ', count ' + d.data.count;
      // var format = d3.format('.1f')
      // var content = format(d.x0) + ' , ' + format(d.x1);
      // var content = format(d.font) + ' , ' + format(d._font);
      // var content = format(d.size) + ' , ' + format(d.value);
      var html = content(d);
      tooltip.show(d3.select(container).node(), html);
    }).on('mousemove', function(){
      tooltip.move(d3.select(container).node());
    }).on('mouseout', function(){
      tooltip.hide();
    });
    function content(d){
      var element = document.createElementNS("http://www.w3.org/2000/svg", "text");
      d3.select(element).call(generate_tspan, d.data.tokens);
      return element.outerHTML;
    }
  }
}
function diagonal(s, d) {
  return `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
}

function collapse_sibling(node){
  recurse(node);
  return node;
  function recurse(r){
    if(r.parent && !r.parent._collapsed){
      r.parent._collapsed = [];
      r.parent.children.forEach(function(c, i){
        if(r.id !== c.id) r.parent._collapsed.push(c);
      });
      r.parent.children = [r];
      recurse(r.parent);
    }
  }
}
function expand_sibling(node){
  recurse(node);
  return node;
  function recurse(r){
    if(r){
      r.children && r.children.forEach(recurse);
      r._collapsed && r._collapsed.forEach(function(c){
        r.children.push(c);
      });
      delete r._collapsed;
    }
  }
}
function adjust_descendants_font(node, root){
  node.eachBefore(function(r){
    var h = r.value / root.value * height;
    var count2font = count2font_factory(r.data.count, h);
    r.children && r.children.forEach(function(c){
      c.font = Math.min(r.font, count2font(c.data.count));
    });
  });
}
function collapse_font(node, root){
  var font = root.font;
  var r = node;
  while(r.parent){
    r.font = font; r = r.parent;
  }
  adjust_descendants_font(node, root);
  return node;
}
function expand_font(node, root){
  if(node === root){
    node.eachBefore(function(r){
      r.font = r.ofont;
    });
  } else {
    adjust_descendants_font(node, root);
  }
  return node;
}
function collapse_value(node, root){
  var value = root.value;
  var r = node;
  while(r.parent){
    r.value = value;
    r = r.parent;
  }
  recurse(node);
  return node;
  function recurse(r){
    r && r.children && r.children.forEach(function(c){
      c.value = c.size / r.size * r.value;
      recurse(c);
    });
  }
}
function expand_value(node){
  node.each(function(r){
    r && r.children && r.children.forEach(function(c){
      c.value = c.size / r.size * r.value;
    });
  });
  return node;
}
