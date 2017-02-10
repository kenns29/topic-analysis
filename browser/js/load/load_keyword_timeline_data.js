var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
module.exports = exports = function(){
  var data;
  var type = DOC.A;
  var level = DOC.P;
  var field = DOC.TITLE;
  var keyword = '';
  function load(_keyword){
    if(_keyword) keyword = _keyword;
    var deferred = $.ajax({
      url : service_url + '/loadkeywordtimelinedata',
      data : {type:type,level:level,field:field,keyword:keyword},
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(_keyword){
    if(_keyword) keyword = _keyword;
    return load();
  }
  ret.data = function(){return data;};
  ret.load = load;
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.keyword = function(_){return arguments.length > 0 ? (keyword = _, ret) : keyword;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  return ret;
};