var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var name;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadtopicmodelstats',
      data : {},
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
  ret.name = function(_){return arguments.length > 0 ? (name=_,ret):name;};
  ret.load = load;
  return ret;
};
