var $ = require('jquery');
module.exports = exports = upload;
function upload(){
  var data = '';
  function post(){
    var deferred = $.ajax({
      url : service_url + '/usertopics',
      method : 'POST'
      data : data,
      dataType: 'json'
    });
    return Promise.resolve(deferred);
  }
  function ret(){}

  return ret;
}
