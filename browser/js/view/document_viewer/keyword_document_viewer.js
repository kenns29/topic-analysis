var d3 = require('../../load_d3');
var $ = require('jquery');
var util = require('../../util.js');
var DOC = require('../../../../flags/doc_flags');
var LoadPapers = require('../../load/load_papers');
var LoadPanels = require('../../load/load_panels');
module.exports = exports = function(){
  var container = '#keyword-document-viewer-div';
  var data = [];
  var width;
  var level = DOC.P;
  var type = DOC.A;
  var loading;
  var year = global.UI_year_select.year();
  function init(){
    width = $(container).width();
    d3.select(container).attr('class', 'keyword-document-viewer');
    loading = d3.select(container).select('.loading').node();
    return ret;
  }
  function load(){

  }
  function update(){
    var div_sel =  d3.select(container).selectAll('.document').data(data, function(d){return d.id;});
    var div_enter = div_sel.enter().append('div')
    .attr('class', 'document')
    .style('margin', '0px 0px 0px 0px')
    .style('padding', '0px 0px 0px 0px');
    div_enter.append('div').attr('class', 'year')
    .style('display', 'inline-block')
    .style('vertical-align', 'top')
    .style('height', 'auto')
    .style('width', '50px')
    .html(function(d){return d.year;});
    var div_main_enter = div_enter.append('div').attr('class', 'main')
    .style('position', 'relative')
    .style('display', 'inline-block')
    .style('vertical-align', 'inline-block')
    .style('width', (width - 50 - 30) + 'px');
    div_main_enter.append('div').attr('class', 'title').style('width', '100%').style('background-color', '#F8F8F8');
    div_main_enter.append('div').attr('class', 'distr').style('width', '100%');
    div_sel.exit().remove();
    var div_update = d3.select(container).selectAll('.document');
    div_update.sort(function(a, b){return a.index - b.index;});
    div_update.select('.year').html(function(d){return d.year;});
    div_update.select('.main').select('.title').each(update_title_span);
    return ret;
  }
  function update_title_span(d, i){

  }

  function order_documents(){

    return data;
  }
  var ret = {};
  ret.container = function(_){return arguments.length > 0 ? (container = _, ret) : container;};
  ret.init = init;
  ret.update = update;
  ret.data = function(_){
    if(arguments.length > 0){
      data = _;
      data.forEach(function(d){
        d.id = Number(level + '' + d.id);
      });
      return ret;
    } else return data;
  };
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.loading = function(){return loading;};
  ret.load = load;
  ret.documents = function(){return d3.select(container).selectAll('.document');};
  return ret;
};
