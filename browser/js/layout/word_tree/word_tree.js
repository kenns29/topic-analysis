var d3 = require('d3');
var Hierarchy = require('./hierarchy');
var Partition = require('./partition');
var count2font_factory = require('./count2font');
module.exports = exports = word_tree;
function word_tree(){
  var data_forward, data_reverse;
  var hierarchy_forward;
  var hierarchy_reverse;
  var partition_forward;
  var partition_reverse;
  var root_forward;
  var root_reverse;
  var nodes_forward;
  var nodes_reverse;
  var links_forward;
  var links_reverse;
  var nodes;
  var links;
  function update(source){
    var layout_height_forward = hierarchy_forward.height() > height ? hierarchy_forward.height() : height;
    var layout_height_reverse = hierarchy_reverse.height() > height ? hierarchy_reverse.height() : height;
    var partition_forward = Partition().hierarchy(hierarchy_forward).reverse(false).height(layout_height_forward).width(width/2).update();
    partition_forward.move_y(width/2);
    var partition_reverse = Partition().hierarchy(hierarchy_reverse).reverse(true).height(layout_height_reverse).width(width/2).update();
    root_reverse.text_length = root_forward.text_length;
    partition_reverse.move_y(root_forward.y1);
    partition_reverse.move_x(root_forward.x);
    return ret;
  }
  function ret(){}
  ret.data = function(_data, _reverse){
    if(arguments.length > 0){
        if(!_reverse){
          data_forward = _data;
          hierarchy_forward = Hierarchy().reverse(false).make(_data);
          root_forward = hierarchy_forward.root();
          nodes_forward = root_forward.descendants();
          links_forward = root_forward.descendants().slice(1);
        }
        else{
          data_reverse = _data;
          hierarchy_reverse = Hierarchy().reverse(true).make(_data);
          root_reverse = hierarchy_reverse.root();
          nodes_reverse = root_reverse.descendants();
          links_reverse = root_reverse.descendants().slice(1);
        }
        return ret;
    }
    return {data_forward : data_forward, data_reverse : data_reverse};
  };
  ret.update = update;
  ret.nodes = function(){
    return nodes_forward.concat(links_reverse);
  };
  ret.links = function(){
    return links_forward.concat(links_reverse);
  };
  ret.collapse = collapse;
  ret.expand = expand;
  return ret;

  function collapse(node){
    var r;
    if(!node.parent || node._collapsed) return;
    if(node === (r = hierarchy_forward.root())){
      op(r, r);
      op(r = hierarchy_reverse.root(), r);
    } else {
      r = d.reverse ? hierarchy_reverse.root() : hierarchy_forward.root();
      op(d, r);
    }
    function op(node, root){
      collapse_sibling(node);
      collapse_value(node, root);
      collapse_font(node, root);
    }
    if(!node.reverse) hierarchy_forward.adjust();
    else hierarchy_reverse.adjust();
    return ret;
  }
  function expand(node){
    var r;
    if(!node._collapsed) return;
    if(node === (r = hierarchy_forward.root())){
      op(r, r);
      op(r = hierarchy_reverse.root(), r);
    } else {
      r = d.reverse ? hierarchy_reverse.root() : hierarchy_forward.root();
      op(d, r);
    }
    function op(node, root){
      expand_sibling(node);
      expand_value(node);
      expand_font(node, root);
    }
    if(!node.reverse) hierarchy_forward.adjust();
    else hierarchy_reverse.adjust();
    return ret;
  }

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
