var $ = require('jquery');
var data;
function callback(data){}
function load(){
  var deferred = $.ajax({
    url : service_url + '/loadpapers',
    data : {},
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
module.exports = ret;
