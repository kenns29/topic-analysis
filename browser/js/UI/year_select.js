var $ = require('jquery');
var d3 = require('../load_d3');
var start_year = 1979;
var end_year = 2017;
var from_select = '#from-year';
var to_select = '#to-year';
function init(){
  d3.select(from_select).selectAll('option').data(d3.range(start_year, end_year+1, 1))
  .enter().append('option').attr('value', function(d){return d;})
  .html(function(d){return d;});
  // d3.select(to_select).selectAll('option').data(d3.range(start_year, end_year+1, 1))
  // .enter().append('option').html(function(d){return d;});
  return this;
}
module.exports = init();
module.exports.init = init;
module.exports.year = function(){
  var val = $('#from-year :selected').val();
  return Number(val);
};
