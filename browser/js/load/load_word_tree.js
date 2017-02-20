var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
var DIRECTION = require('../../../flags/word_tree_direction_flags');
var keywords2str = require('./keywords2str');
module.exports = exports = function(){
  var data;
  var model_id;
  var year = 1979;
  var to_year = -1;
  var type = DOC.A;
  var field = DOC.TITLE;
  var keywords;
  var root_word = 'womens';
  var direction = DIRECTION.FORWARD;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadwordtree',
      data : {root_word: root_word,year:year,to_year:to_year,type:type,field:field,
        keywords:keywords2str(keywords), direction:direction},
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
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  ret.root_word = function(_){return arguments.length > 0 ? (root_word = _, ret) : root_word;};
  ret.direction = function(_){return arguments.length > 0 ? (direction = _, ret) : direction;};
  return ret;
};
