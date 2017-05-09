var $ = require('jquery');
var form = document.forms.namedItem('user-topics');
form.addEventListener('submit', function(ev){
  var model_name = $('#upload-user-topics-name').val();
  global.controller_user_topics.add_model(form);
  ev.preventDefault();
}, false);
module.exports = exports = form;
