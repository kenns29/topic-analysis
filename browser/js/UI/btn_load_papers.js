var $ = require('jquery');
var load_papers = require('../load/load_papers');
module.exports = $('#btn-load-papers').click(function(){
  load_papers().then(function(data){
    global.document_viewer.data(data).update();
  });
});
