var d3 = require('d3');
module.exports = exports = function Partition(){
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
      var offset = r.reverse ? -r.text_length : r.text_length;
      var y_space = r.reverse ? -node_y_space : node_y_space;
      if(r.children && r.children.length > 0){
        let end_y = offset + r.y;
        r.children.forEach(function(child){
          child.y0 = child.y = end_y + y_space;
          child.y1 = child.y0 + offset;
        });
      }
    });
    return ret;
  }
  function move_y(root, y){
    var offset = root.reverse ? -root.text_length : root.text_length;
    root.y0 = root.y = y;
    root.y1 = y + offset;
    adjust_y(root);
    return ret;
  }
  function move_x(root, x){
    var x_shift = x - root.x;
    root.eachBefore(function(r){
      r.x += x_shift;
      r.x0 += x_shift;
      r.x1 += x_shift;
    });
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
  ret.move_y = function(y){return move_y(hierarchy.root(), y);};
  ret.move_x = function(x){return move_x(hierarchy.root(), x);};
  ret.svg = function(){return svg;};
  return ret;
}
