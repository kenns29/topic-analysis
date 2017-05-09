var $ = require('jquery');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  var model_name;
  function load(){
    var deferred = $.ajax({
      url : service_url + '/deleteusertopicmodel',
      data : {name : model_name},
      dataType: 'text'
    });
    return Promise.resolve(deferred);
  }
  function ret(){return load();}
  ret.data = function(){return data;};
  ret.load = load;
  ret.model_name = function(_){return arguments.length > 0 ? (model_name=_,ret):model_name;};
  return ret;
};
