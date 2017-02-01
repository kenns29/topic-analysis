var $ = require('jquery');
var LoadPapers = require('../load/load_papers');
var view = global.document_viewer;
module.exports = $('#btn-load-papers').click(function(){
  var loading = view.loading();
  $(loading).show();
  LoadPapers().load().then(function(data){
    $(loading).hide();
    view.data_type(view.PAPER).data(data).update();
  })
  .catch(function(err){
    console.log(err);
    $(loading).hide();
  });
});
