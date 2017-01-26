var d3 = require('d3');
var $ = require('jquery');
var container = '#document-viewer-div';
var data;
var width;
function init(){
  width = $(container).outerWidth(true);
  d3.select(container).attr('class', 'document-viewer');
  return ret;
}
function update(){
  var div_sel =  d3.select(container).selectAll('div').data(data, function(d){return d.id;});
  var div_enter = div_sel.enter().append('div')
  .style('margin-left', '0px')
  .style('padding-left', '0px');
  div_enter.append('div').attr('class', 'year')
  .style('float', 'left')
  .style('height', 'auto')
  .style('width', '100px')
  .style('clear', 'both')
  .html(function(d){return d.year;});
  div_enter.append('div').attr('class', 'title')
  .style('float', 'left')
  .style('width', (400) + 'px')
  .html(function(d){return d.title;});
  div_sel.exit().remove();
  div_sel.select('.year').html(function(d){return d.year;});
  div_sel.select('.title').html(function(d){return d.title;});
  return ret;
}

var ret = {};
ret.init = init;
ret.update = update;
ret.data = function(_){return arguments.length > 0 ?(data =_, ret):data;};
module.exports = init();
