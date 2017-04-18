var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
var array2str = require('./array2str');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  var model_id;
  var year = 1979;
  var to_year = -1;
  var type = DOC.A;
  var field = DOC.TITLE;
  var keywords;
  function callback(data){}
  function load(){
    var keywords_str = array2str(keywords);
    var deferred = $.ajax({
      url : service_url + '/loadpapers',
      data : {model_id:model_id,year:year,to_year:to_year,type:type,field:field,keywords:keywords_str},
      dataType: 'json',
      success : function(data){
        console.log('papers', data);
        callback(data);
      }
    });
    return Promise.resolve(deferred);
  }

  function ret(){return load();}
  ret.callback = function(_){return arguments.length > 0 ? (callback=_,ret):callback;};
  ret.data = function(){return data;};
  ret.load = load;
  ret.model_id = function(_){return arguments.length > 0 ? (model_id =_, ret):model_;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.to_year = function(_){return arguments.length > 0 ? (to_year = _, ret) : to_year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.field = function(_){return arguments.length > 0 ? (field = _, ret) : field;};
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  return ret;
};
