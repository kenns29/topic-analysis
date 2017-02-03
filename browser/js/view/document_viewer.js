var d3 = require('d3');
var $ = require('jquery');
var topic_color = require('./topic_color');
var container = '#document-viewer-div';
var data = [];
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
  order_documents();
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
  // .html(function(d){return d.title;});
  div_main_enter.append('div').attr('class', 'distr').style('width', '100%');
  div_sel.exit().remove();
  var div_update = d3.select(container).selectAll('.document');
  div_update.sort(function(a, b){return a.index - b.index;});
  div_update.select('.year').html(function(d){return d.year;});
  // div_update.select('.main').select('.title').html(function(d){return d.title;});
  div_update.select('.main').select('.title').each(update_title_span);
  div_update.select('.main').select('.distr').each(update_topic_distr);
  return ret;
}
function update_title_span(d, i){
  var span_array = [];
  var title = d.title;
  if(!d.topic_tokens || d.topic_tokens.length === 0){
    span_array.push({span : title, topic : -1});
  } else {
    let len = d.topic_tokens.length;
    let pre_charindex = [0, 0];
    for(let j = 0; j < len; j++){
      let token = d.topic_tokens[j];
      let charindex = token.charindex;
      if(charindex[0] > pre_charindex[1]) span_array.push({span : title.substring(pre_charindex[1], charindex[0]), topic : -1});
      span_array.push({span : title.substring(charindex[0], charindex[1]), topic : token.topic});
      if(j === len - 1 && charindex[1] < len)span_array.push({span : title.substring(charindex[1], len), topic : -1});
      pre_charindex = charindex;
    }
  }
  var span_sel = d3.select(this).selectAll('span').data(span_array);
  var span_enter = span_sel.enter().append('span');
  span_sel.exit().remove();
  var span_update = d3.select(this).selectAll('span');
  span_update.style('color', function(d){
    if(d === -1) return 'black';
    else return topic_color(d.topic);
  });
  span_update.html(function(d){return d.span;});
}
function update_topic_distr(d, i){
  var sel = d3.select(this);
  var dat = d;
  var topic_weight_scale = d3.scaleLinear().domain([0, 1]).range([0, width - 50 - 30]);
  if(dat.topic_distr){
    let topic_array = [];
    for(let i in dat.topic_distr){
      if(dat.topic_distr.hasOwnProperty(i)){
        topic_array.push({id:i,weight:dat.topic_distr[i]});
      }
    }
    let topic_sel = sel.selectAll('.topic').data(topic_array, function(d){return d.id;});
    let topic_enter = topic_sel.enter().append('div').attr('class', 'topic');
    topic_sel.exit().remove();
    let topic_update = sel.selectAll('.topic');
    topic_update.sort(function(a, b){return b.weight - a.weight;});
    topic_update.style('display', 'inline-block').style('vertical-align', 'top')
    .style('width', function(d){return topic_weight_scale(d.weight) + 'px';})
    .style('height', '10px').style('background-color', function(d){return topic_color(d.id);});
  }
}
function order_documents(){
  if(global.topic_viewer.data() && global.topic_viewer.data().length > 0){
    let topic_order = [];
    global.topic_viewer.data().forEach(function(d){
      topic_order[d.id] = d.index;
    });
    data.forEach(function(d){
      var max_topic = 0;
      var max_weight = 0;
      if(d.topic_distr){
        for(let i in d.topic_distr){
          if(d.topic_distr.hasOwnProperty(i)){
            let weight = d.topic_distr[i];
            if(weight > max_weight)max_weight = weight, max_topic = i;
          }
        }
      }
      d.topic = max_topic;
    });
    data.sort(function(a, b){return topic_order[a.topic] - topic_order[b.topic];});
    data.forEach(function(d, i){d.index = i;});
  }
  return data;
}
var ret = {};
ret.container = function(_){return arguments.length > 0 ? (container = _, ret) : container;};
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
ret.documents = function(){return d3.select(container).selectAll('.document');};
module.exports = init();
