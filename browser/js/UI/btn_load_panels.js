var $ = require('jquery');
var DOC = require('../../../flags/doc_flags');
module.exports = $('#btn-load-panels').click(function(){
  var year = global.UI_year_select.year();
  // global.topic_document_viewer.year(year).level(DOC.PN).type(-1)
  // .load().then(function(data){
  //   global.topic_document_viewer.data(data).update();
  // });
});
