var $ = require('jquery');
var load_papers = require('../load/load_papers');
var view = global.document_viewer;
module.exports = $('#btn-load-papers').click(function(){
  load_papers().then(function(data){
    view.data_type(view.PAPER).data(data).update();
  });
});
