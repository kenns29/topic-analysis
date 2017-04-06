var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
var service_url = require('../service');
module.exports = exports = function(){
  var level = DOC.P;
  var type = DOC.A;
  var field = DOC.TITLE;
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadtfidf',
      data : {level:level, type:type, field : field},
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(){return load();}
  ret.data = function(){return data;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.load = load;
  return ret;
};
