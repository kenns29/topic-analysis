var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var id;
  function callback(data){}
  function load(){
    var year = Number(model_name.match(/\d{4}/));
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
