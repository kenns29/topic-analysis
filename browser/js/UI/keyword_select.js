var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadTfidf = require('../load/load_tfidf');
module.exports = exports = function(){
  var select_container = '#keyword-select-div #select-keyword';
  var data;
  function update(_data){
    if(_data) data = _data;
    sort_words();
    var dat = trunk_words(data);
    var word_sel = d3.select(select_container).selectAll('option').data(dat, function(d){return d.word;});
    var word_enter = word_sel.enter().append('option').attr('value', function(d){return d.word;})
    .html(function(d){return d.word;});
    word_sel.exit().remove();
    return ret;
  }
  function sort_words(){
    data.sort(function(a, b){return b.tfidf - a.tfidf;});
  }
  function trunk_words(data){
    return data.slice(0, 60);
  }
  function load(){
    var level_str = $('#keyword-select-div #select-level').val();
    var type_str = $('#keyword-select-div #select-type').val();
    var field_str = $('#keyword-select-div #select-field').val();
    var level = str2flag(level_str);
    var type = str2flag(type_str);
    var field = str2flag(field_str);
    return LoadTfidf().type(type).level(level).field(field).load().then(function(dat){
      data = dat; return Promise.resolve(data);
    });
  }
  function init(){
    load().then(function(data){
      update();
    });
    return ret;
  }
  var ret = {};
  ret.init = init;
  ret.load = load;
  ret.update = update;
  return ret;
};

function str2flag(str){
  switch(str){
    case 'P' : return DOC.P;
    case 'PN' : return DOC.PN;
    case 'A' : return DOC.A;
    case 'RW' : return DOC.RW;
    case 'TITLE' : return DOC.TITLE;
    case 'ABSTRACT' : return DOC.ABSTRACT;
    case 'ALL' : return -1;
    default : return -1;
  }
}
