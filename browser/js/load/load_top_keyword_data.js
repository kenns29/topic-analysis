var $ = require('jquery');
var service_url = require('../service');
module.exports = exports = function(){
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadtopkeyworddata',
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(){
    return load();
  }
  ret.load = load;
  return ret;
};


