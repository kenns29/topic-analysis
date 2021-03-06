var d3 = require('../../load_d3');
var $ = require('jquery');
var util = require('../../util.js');
var DOC = require('../../../../flags/doc_flags');
var LoadPapers = require('../../load/load_papers');
var LoadPanels = require('../../load/load_panels');
var topic_color = require('../topic_color');
module.exports = exports = function(){
  var container = '#topic-document-viewer-div';
  var data = [];
  var width;
  var level = DOC.P;
  var type = DOC.A;
  var loading;
  var year = global.UI_year_select.year();
  function init(){
    width = $(container).width();
    d3.select(container).attr('class', 'document-viewer');
    loading = d3.select(container).select('.loading').node();
    return ret;
  }
  function load(){
    var model_id = global.model_stats_display.selected_model().id;
    if(level === DOC.P){
      $(loading).show();
      return LoadPapers().model_id(model_id).year(year).type(type).load().then(function(data){
        $(loading).hide();
        return Promise.resolve(data);
      })
      .catch(function(err){
        console.log(err);
        $(loading).hide();
      });
    }
    else if(level === DOC.PN){
      $(loading).show();
      return LoadPanels().model_id(model_id).year(year).type(type).load().then(function(data){
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
    // .style('display', 'inline-block')
    .style('vertical-align', 'top')
    .style('height', 'auto')
    .style('width', '50px')
    .style('float', 'left')
    .html(function(d){return d.year;});
    var div_main_enter = div_enter.append('div').attr('class', 'main')
    .style('position', 'relative')
    // .style('display', 'inline-block')
    .style('overflow', 'hidden')
    .style('vertical-align', 'inline-block');
    // .style('width', (width - 50 - 30) + 'px');
    div_main_enter.append('div').attr('class', 'title').style('width', '100%').style('background-color', '#F8F8F8');
    div_main_enter.append('div').attr('class', 'distr').style('width', '100%');
    div_sel.exit().remove();
    var div_update = div_sel.merge(div_enter);
    div_update.sort(function(a, b){return a.index - b.index;});
    div_update.select('.year').html(function(d){return d.year;});
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
        if(token.orig_token){
          charindex = [token.orig_token.begin_position, token.orig_token.end_position];
        }
        if(charindex[0] > pre_charindex[1]) span_array.push({span : title.substring(pre_charindex[1], charindex[0]), topic : -1});
        span_array.push({span : title.substring(charindex[0], charindex[1]), topic : token.topic});
        if(j === len - 1 && charindex[1] < title.length)span_array.push({span : title.substring(charindex[1], title.length), topic : -1});
        pre_charindex = charindex;
      }
    }
    var span_sel = d3.select(this).selectAll('span').data(span_array);
    var span_enter = span_sel.enter().append('span');
    span_sel.exit().remove();
    var span_update = span_sel.merge(span_enter);
    span_update.style('background-color', function(d){
      if(d.topic === -1) return 'white';
      else{
        let hex = topic_color(d.topic);
        let rgb = {r:255, g:255, b:255};
        try{rgb = util.hexToRgb(hex);}
        catch(err){console.log(err);}
        return 'rgba(' + [rgb.r, rgb.g, rgb.b, 0.3] + ')';
      }
    });
    span_update.html(function(d){return d.span;});
  }
  function update_topic_distr(d, i){
    var sel = d3.select(this);
    var dat = d;
    var topic_weight_scale = d3.scaleLinear().domain([0, 1]).range([0, 100]);
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
      let topic_update = topic_sel.merge(topic_enter);
      topic_update.sort(function(a, b){return b.weight - a.weight;});
      topic_update.style('float', 'left')
      .style('width', function(d){return topic_weight_scale(d.weight) + '%';})
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
  function scroll_to_topic(topic){
    var nodes = ret.documents().nodes();
    var top = 0;
    if(nodes){
      for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        let dat = d3.select(node).data()[0];
        if(Number(dat.topic) == Number(topic)){
          top = $(node).position().top + $(container).scrollTop();
          break;
        }
      }
    }
    $(container).animate({
      scrollTop : top
    }, 1000);
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
  ret.scroll_to_topic = scroll_to_topic;
  return ret;
};
