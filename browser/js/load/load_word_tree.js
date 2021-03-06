var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
var DIRECTION = require('../../../flags/word_tree_direction_flags');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  var model_id;
  var year = 1979;
  var to_year = -1;
  var type = DOC.A;
  var field = DOC.TITLE;
  var root_word = 'womens';
  var direction = DIRECTION.FORWARD;
  var level = DOC.P;
  var use_stopwords = false;
  var use_lemma = false;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadwordtree',
      data : {root_word:root_word,year:year,to_year:to_year,type:type,field:field,
        direction:direction,level:level,use_stopwords:use_stopwords,use_lemma:use_lemma},
      dataType: 'json',
      success : function(data){
        callback(data);
      }
    });
    return Promise.resolve(deferred);
  }

  function ret(){return load();}
  ret.callback = function(_){return arguments.length > 0 ? (callback=_,ret):callback;};
  ret.data = function(){return data;};
  ret.load = load;
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.to_year = function(_){return arguments.length > 0 ? (to_year = _, ret) : to_year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.root_word = function(_){return arguments.length > 0 ? (root_word = _, ret) : root_word;};
  ret.direction = function(_){return arguments.length > 0 ? (direction = _, ret) : direction;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.use_stopwords = function(_){return arguments.length > 0 ? (use_stopwords = _, ret) : use_stopwords;};
  ret.use_lemma = function(_){return arguments.length > 0 ? (use_lemma = _, ret) : use_lemma;};
  return ret;
};
