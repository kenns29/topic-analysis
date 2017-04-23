var form = document.forms.namedItem('user-topics');
form.addEventListener('submit', function(ev){
  var oData = new FormData(form);
  var oReq = new XMLHttpRequest();
  oReq.open("POST", "/usertopics", true);
  oReq.onload = function(oEvent) {
    if (oReq.status == 200) {
      alert('uploaded');
    } else {
      alert('error');
    }
  };

  oReq.send(oData);
  ev.preventDefault();
}, false);
module.exports = exports = form;
