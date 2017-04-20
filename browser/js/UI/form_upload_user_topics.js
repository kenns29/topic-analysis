// var form = document.forms.namedItem('user-topics');
// form.addEventListener('submit', function(ev){
//   var oData = new FormData(form);
//
//   oData.append("CustomField", "This is some extra data");
//
//   var oReq = new XMLHttpRequest();
//   oReq.open("POST", "/usertopics", true);
//   oReq.onload = function(oEvent) {
//     if (oReq.status == 200) {
//       alert('uploaded');
//     } else {
//       alert('error');
//     }
//   };
//
//   oReq.send(oData);
//   ev.preventDefault();
// }, false);
// module.exports = exports = form;
document.getElementById('upload-user-topics')
.addEventListener('change', upload, false);

function upload(e){
  var files = e.target.files;
  let file;
  console.log('change');
  if(e.target.files.length === 0) return;
  for(let i = 0; file = files[i]; i++){
    let reader = new FileReader();
    reader.onload = function(e){
      var contents = e.target.result;
      console.log('contents', contents);
      var oReq = new XMLHttpRequest();
      oReq.open("POST", "/usertopics", true);
      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
          alert('uploaded');
        } else {
          alert('error');
        }
      };
      oReq.setRequestHeader('Content-Type', 'text/plain');
      oReq.send(contents);
    };
    reader.readAsText(file);
  }
}

// var $ = require('jquery');
// var service_url = require('../service');
// var form = document.forms.namedItem('user-topics');
// form.addEventListener('submit', function(ev){
//   var data = new FormData(data);
//   console.log('form data', data);
//   $.ajax({
//     url : service_url + '/usertopics',
//     method : 'POST',
//     data : new FormData(form),
//     cache : false,
//     contentType : false,
//     processData : false,
//     success : function(data){
//       console.log('post', data);
//     },
//     fail : function(jqXHR, textStatus, errorThrown){
//       console.log('jqXHR', jqXHR);
//       console.log('textStatus', textStatus);
//       console.log('errorThrown', errorThrown)
//     }
//   });
// });
