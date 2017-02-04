var $ = require('jquery');
module.exports = $('#btn-load-panels').click(function(){
  var year = global.UI_year_select.year();
  global.document_viewer.year(year).data_type(global.document_viewer.PANEL)
  .load().then(function(data){
    global.document_viewer.data(data).update();
  });
});
