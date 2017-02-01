var $ = require('jquery');
module.exports = $('#btn-load-panels').click(function(){
  global.document_viewer.data_type(global.document_viewer.PANEL)
  .load().then(function(data){
    global.document_viewer.data(data).update();
  });
});
