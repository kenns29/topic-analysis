var $ = require('jquery');
var LoadPapers = require('../load/load_papers');
var view = global.document_viewer;
module.exports = $('#btn-load-papers').click(function(){
  var model_name = global.model_stats_display.selected_model().name;
  var loading = view.loading();
  $(loading).show();
  LoadPapers().model_name(model_name).load().then(function(data){
    $(loading).hide();
    console.log('data', data);
    view.data_type(view.PAPER).data(data).update();
  })
  .catch(function(err){
    console.log(err);
    $(loading).hide();
  });
});
