var $ = require('jquery');
var service_url = require('../service');
module.exports = exports = function(){
  var data;
  function load(){
    var deferred = $.ajax({
      url : service_url + '/loadusertopics',
      data : {},
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(){
    return load();
  }
  ret.data = function(){return data;};
  ret.load = load;
  return ret;
};
