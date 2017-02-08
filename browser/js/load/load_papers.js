var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
module.exports = exports = function(){
  var data;
  var model_id;
  var year = 1979;
  var type = DOC.A;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadpapers',
      data : {model_id:model_id, year:year, type:type},
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
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.title = function(_){return arguments.length > 0 ? (title = _, ret) : title;};
  return ret;
};
