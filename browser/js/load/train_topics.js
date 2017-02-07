var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
module.exports = exports = function(){
  var data;
  var num_topics = 10;
  var num_iterations = 500;
  var model_name = 'default';
  var year = 1979;
  var type = DOC.A;
  var level = DOC.P;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/topictrainer',
      data : {
        name : model_name,
        num_topics : num_topics,
        num_iterations : num_iterations,
        year : year,
        type : type,
        level : level
      },
      dataType: 'json',
      success : function(data){
        callback(data);
      }
    });
    return Promise.resolve(deferred);
  }
  function ret(){
    return load();
  }
  ret.callback = function(_){return arguments.length > 0 ? (callback=_,ret):callback;};
  ret.data = function(){return data;};
  ret.num_iterations = function(_){return arguments.length > 0 ? (num_iterations=_,ret):num_iterations;};
  ret.num_topics = function(_){return arguments.length > 0 ? (num_topics=_,ret):num_topics;};
  ret.load = load;
  ret.model_name = function(_){return arguments.length > 0 ? (model_name=_,ret):model_name;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  return ret;
};
