var $ = require('jquery');
var load_panels = require('../load/load_panels');
var view = global.document_viewer;
module.exports = $('#btn-load-panels').click(function(){
  var loading = view.loading();
  $(loading).show();
  load_panels().then(function(data){
    $(loading).hide();
    view.data_type(view.PANEL).data(data).update();
  })
  .catch(function(err){
    console.log(err);
    $(loading).hide();
  });
});
