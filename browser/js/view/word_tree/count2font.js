var d3 = require('d3');
module.exports = exports = count2font_factory;
module.exports.font_size = font_size;
function count2font_factory(b, k){
  var S = d3.scaleSqrt().domain([0, k]).range([0, 25]);
  return function(count){

    return font_size(count, b, k, S);
  };
}
function font_size(e, b, k, S) {
    var t = e / b * k;
    return e.children && e.children.length ? "0px" | (t > 30 ? 30 + S(e - 30 * b / k) : t - 1) : Math.max(0, Math.min(15, t - 1));
}
