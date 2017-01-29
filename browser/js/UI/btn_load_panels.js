var $ = require('jquery');
var load_panels = require('../load/load_panels');
var view = global.document_viewer;
module.exports = $('#btn-load-panels').click(function(){
  load_panels().then(function(data){
    view.data_type(view.PANEL).data(data).update();
  });
});
