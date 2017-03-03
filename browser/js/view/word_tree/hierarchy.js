var d3 = require('../../load_d3');
var SIZE = require('./size');
var height = SIZE[1];
var count2font_factory = require('./count2font');
module.exports = exports = Hierarchy;
function Hierarchy(){
  var data, root, hierarchy_height = SIZE[1], count2font, count_extent;
  var reverse;
  function make(_){
    if(arguments.length > 0) data = _;
    root = d3.hierarchy(data);
    count_extent = d3.extent(root.descendants(), function(d){return d.data.count;});
    // count2font = count2font_factory(count_extent);
    count2font = count2font_factory(root.data.count, height);
    assign_font(count2font);
    var leave = leaf_values(root, count2font);
    adjust_height();
    root.sum(function(d){return d.value;});
    root.sort(function(a, b){return b.data.count - a.data.count;});
    ret.count2font = count2font;
    assign_reverse(reverse);
    assign_size();
    return ret;
  }
  function assign_font(count2font){
    root.eachBefore(function(r){
      r.font = count2font(r.data.count);
      r.ofont = r.font;
    });
  }
  function assign_reverse(reverse){
    root.eachBefore(function(r){
      r.reverse = reverse;
    });
  }
  function assign_size(){
    root.eachBefore(function(r){
      r.size = r.value;
    });
  }
  function adjust_height(){
    var leave = root.leaves();
    hierarchy_height = Math.max(height, height_by_leave(leave));
    return ret;
  }
  function adjust(){
    adjust_height();
    root.sort(function(a, b){return b.data.count - a.data.count;});
    return ret;
  }
  function ret(_){return make(_);}
  ret.make = make;
  ret.data = function(_){return arguments.length > 0 ?(data =_, ret) : data;};
  ret.root = function(_){return arguments.length > 0 ?(root =_, ret) : root;};
  ret.height = function(_){return arguments.length > 0 ?(hierarchy_height =_, ret) : hierarchy_height;};
  ret.count_extent = function(_){return arguments.length > 0 ?(count_extent =_, ret) : count_extent;};
  ret.reverse = function(_){return arguments.length > 0 ?(reverse =_, ret) : reverse;};
  ret.adjust_height = adjust_height;
  ret.adjust = adjust;
  return ret;
}
function leaf_values(root, count2font){
  var leaves = root.leaves();
  leaves.forEach(function(d){
    d.font = count2font(d.data.count);
    d.data.value = d.value = Math.max(5, d.font);
  });
  return leaves;
}
function height_by_leave(leave){
  return d3.sum(leave, function(d){return d.data.value;});
}
