var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var model_name;
  function callback(data){}
  function load(){
    var year = Number(model_name.match(/\d{4}/));
    var deferred = $.ajax({
      url : service_url + '/loadtopicmodel',
      data : {name : model_name},
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
  ret.model_name = function(_){return arguments.length > 0 ? (model_name=_, ret) : model_name;};
  ret.load = load;
  return ret;
};
