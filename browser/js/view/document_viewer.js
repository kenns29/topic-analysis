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
function load(){
  var LoadPapers = require('../load/load_papers');
  var LoadPanels = require('../load/load_panels');
  var model_name = global.model_stats_display.selected_model().name;
  if(data_type === PAPER){
    $(loading).show();
    return LoadPapers().model_name(model_name).load().then(function(data){
      $(loading).hide();
      return Promise.resolve(data);
    })
    .catch(function(err){
      console.log(err);
      $(loading).hide();
    });
  }
  else if(data_type === PANEL){
    $(loading).show();
    return LoadPanels().load().then(function(data){
      $(loading).hide();
      return Promise.resolve(data);
    })
    .catch(function(err){
      console.log(err);
      $(loading).hide();
    });
  }
  return Promise.resove([]);
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
  var div_main_enter = div_enter.append('div').attr('class', 'main')
  .style('position', 'relative')
  .style('float', 'left')
  .style('width', (width - 50 - 30) + 'px');
  div_main_enter.append('div').attr('class', 'title').style('width', '100%')
  .html(function(d){return d.title;});
  div_main_enter.append('div').attr('class', 'distr').style('width', '100%');
  div_sel.exit().remove();
  var div_update = d3.select(container).selectAll('div');
  div_update.select('.year').html(function(d){return d.year;});
  div_update.select('.main').select('.title').html(function(d){return d.title;});
  div_update.select('.main').select('.distr').each(update_topic_distr);
  return ret;
}
function update_topic_distr(d, i){
  var sel = d3.select(this);
  var dat = d;
  var topic_color = require('./topic_color');
  var topic_weight_scale = d3.scaleLinear().domain([0, 1]).range([0, width - 50 - 30]);
  if(dat.topic_distr){
    let topic_array = [];
    for(let i in dat.topic_distr){
      if(dat.topic_distr.hasOwnProperty(i)){
        topic_array.push({id:i,weight:dat.topic_distr[i]});
      }
    }
    var topic_sel = sel.selectAll('.topic').data(topic_array, function(d){return d.id;});
    var topic_enter = topic_sel.enter().append('div').attr('class', 'topic');
    topic_sel.exit().remove();
    var topic_update = sel.selectAll('.topic');
    topic_update.sort(function(a, b){return b.weight - a.weight;});
    topic_update.style('display', 'inline-block').style('vertical-align', 'top')
    .style('width', function(d){return topic_weight_scale(d.weight) + 'px';})
    .style('height', '10px').style('background-color', function(d){return topic_color(d.id);});
  }
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
ret.load = load;
module.exports = init();
