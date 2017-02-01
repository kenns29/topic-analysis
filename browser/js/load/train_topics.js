var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var num_topics = 10;
  var num_iterations = 500;
  var model_name = 'default';
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/topictrainer',
      data : {
        name : model_name,
        num_topics : num_topics,
        num_iterations : num_iterations
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
  return ret;
};
