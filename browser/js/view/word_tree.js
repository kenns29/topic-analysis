

module.exports = exports = word_tree;



var text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
  return d;
}));
var tiny_text_scale = d3.scale.threshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 0, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
  return d * 0.5;
}));
var margin = {top:20, right:120, bottom:20, left:120};
function word_tree(){
  var data;
  function update(source){

  }
  var ret = {};
  ret.data = function(_){return arguments.length > 0 ? (data = _ : ret) : data;};
  return ret;
}
