var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var id;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/deletetopicmodel',
      data : {id : id},
      dataType: 'text',
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
  ret.id = function(_){return arguments.length > 0 ? (id=_,ret):id;};
  return ret;
};
