var $ = require('jquery');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  var id;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadtopicmodel',
      data : {id : id},
      dataType: 'json',
      success : function(_){
        data = _; callback(data);
      }
    });
    return Promise.resolve(deferred);
  }
  function ret(){
    return load();
  }
  ret.callback = function(_){return arguments.length > 0 ? (callback=_,ret):callback;};
  ret.data = function(){return data;};
  ret.id = function(_){return arguments.length > 0 ? (id=_, ret) : id;};
  ret.load = load;
  return ret;
};
