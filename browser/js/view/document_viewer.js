var d3 = require('d3');
var $ = require('jquery');
var container = '#document-viewer-div';
var data;
var width;
const PAPER = 1;
const PANEL = 2;
var data_type = PAPER;
var loading;
function init(){
  width = $(container).width();
  d3.select(container).attr('class', 'document-viewer');
  loading = d3.select(container).select('.loading').node();
  return ret;
}
function update(){
  var div_sel =  d3.select(container).selectAll('.document').data(data, function(d){return d.id;});
  var div_enter = div_sel.enter().append('div')
  .attr('class', 'document')
  .style('margin', '0px 0px 0px 0px')
  .style('padding', '0px 0px 0px 0px');
  div_enter.append('div').attr('class', 'year')
  .style('float', 'left')
  .style('height', 'auto')
  .style('width', '50px')
  .style('clear', 'both')
  .html(function(d){return d.year;});
  div_enter.append('div').attr('class', 'title')
  .style('float', 'left')
  .style('width', (width - 50 - 30) + 'px')
  .html(function(d){return d.title;});
  div_sel.exit().remove();
  var div_update = d3.select(container).selectAll('div');
  div_update.select('.year').html(function(d){return d.year;});
  div_update.select('.title').html(function(d){return d.title;});
  return ret;
}

var ret = {};
ret.init = init;
ret.update = update;
ret.data_type = function(_){return arguments.length > 0 ? (data_type =_, ret) : data_type;};
ret.data = function(_){
  if(arguments.length > 0){
    data = _;
    data.forEach(function(d){
      d.id = Number(data_type + '' + d.id);
    });
    return ret;
  } else return data;
};
ret.PANEL = PANEL;
ret.PAPER = PAPER;
ret.loading = function(){return loading;};
module.exports = init();
