var $ = require('jquery');
module.exports = $('#btn-load-papers').click(function(){
  $.ajax({
    url : service_url + '/loadpapers',
    data : {},
    dataType: 'json',
    success : function(data){
      global.document_viewer.data(data).update();
    }
  });
});
