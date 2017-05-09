var $ = require('jquery');
module.exports = exports = upload;
function upload(){
  var data = '';
  var form;
  function post(_form){
    if(_form) form = _form;
    var oData = new FormData(form);
    var oReq = new XMLHttpRequest();
    return new Promise(function(resolve, reject){
      oReq.open("POST", "/usertopics", true);
      oReq.onload = function(oEvent){
        if(oReq.status == 200){
          data = oReq.response;
          return resolve(data);
        } else {
          return reject(oReq.response);
        }
      };
      oReq.send(oData);
    });
  }
  function ret(){return post();}
  ret.post = post;
  ret.form = function(_){return arguments.length > 0 ? (form = _, ret) : form;};
  ret.data = function(){return data;};
  return ret;
}
