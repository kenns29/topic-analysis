var $ = require('jquery');
module.exports = exports = function(){
  var data;
  var year = 1979;
  function callback(data){}
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadpanels',
      data : {year:year},
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
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  return ret;
};
