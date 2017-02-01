var $ = require('jquery');
module.exports = $('#btn-load-papers').click(function(){
  global.document_viewer.data_type(global.document_viewer.PAPER)
  .load().then(function(data){
    global.document_viewer.data(data).update();
  });
});
