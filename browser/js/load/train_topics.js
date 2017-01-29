var $ = require('jquery');
var data;
var num_topics = 10;
var num_iterations = 500;
function callback(data){}
function load(){
  var deferred = $.ajax({
    url : service_url + '/topictrainer',
    data : {
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
module.exports = ret;
