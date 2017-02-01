var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var model_name;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadpapers',
      data : {model_name : model_name},
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
  ret.load = load;
  ret.model_name = function(_){return arguments.length > 0 ? (model_name =_, ret):model_name;};
  return ret;
};
