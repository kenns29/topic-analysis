var $ = require('jquery');
var form = document.forms.namedItem('user-topics');
var UploadUserTopics = require('../load/upload_user_topics');
var co = require('co');
form.addEventListener('submit', function(ev){
  var model_name = $('#upload-user-topics-name').val();
  co(function*(){
    var data = yield UploadUserTopics().form(form).post();
    alert('upload successful');
  }).catch(function(err){
    if(err == 'DUP'){
      alert('Sorry, the model name already exists.')
    }
    console.log(err);
  });

  ev.preventDefault();
}, false);
module.exports = exports = form;
