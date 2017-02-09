var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
module.exports = exports = function(){
  var data;
  var model_id;
  var year = 1979;
  var type = DOC.A;
  var field = DOC.TITLE;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadpapers',
      data : {model_id:model_id, year:year, type:type, field:field},
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
  ret.model_id = function(_){return arguments.length > 0 ? (model_id =_, ret):model_;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  return ret;
};
