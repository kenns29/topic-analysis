var $ = require('jquery');
var array2str = require('./array2str');
module.exports = exports = function(){
  var data;
  var ids = [];
  var year=-1, type=-1, level=-1,field=-1,name='';
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadtopicmodel',
      data : {ids:ids,year:year,type:type,level:level,field:field,name:name},
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
  ret.ids = function(_){return arguments.length > 0 ? (ids =_, ret) : ids;};
  ret.load = load;
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  return ret;
};
