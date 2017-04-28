var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
var KeywordTimelineFlags = require('../../../flags/keyword_timeline_flags');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  var type = DOC.A;
  var level = DOC.P;
  var field = DOC.TITLE;
  var percent = false;
  var metric = KeywordTimelineFlags.METRIC_DOCUMENT;
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadusertopictimelinedata',
      data : {type:type,level:level,field:field,percent:percent,metric:metric},
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(){
    return load();
  }
  ret.data = function(){return data;};
  ret.load = load;
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.level = function(_){return arguments.length > 0 ? (level = _, ret) : level;};
  ret.percent = function(_){return arguments.length > 0 ? (percent = _, ret) : percent;};
  ret.metric = function(_){return arguments.length > 0 ? (metric = _, ret) : metric;};
  return ret;
};
