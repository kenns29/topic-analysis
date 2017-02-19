var d3 = require('../load_d3');
var $ = require('jquery');
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
  var data;
  var hierarchy;
  var partition;
  function update(source){
    partition = d3.partition(hierarchy);

  }
  var ret = {};
  ret.data = function(_){
    if(arguments.length > 0){
        data = _;
        hierarchy = d3.hierarchy(data);
        return ret;
    }
    return data;
  };
  return ret;
}
