var $ = require('jquery');
module.exports = exports = $('#keyword-select-div #checkbox-brush').change(function(){
  if($(this).is(':checked')){
    global.multi_keyword_timeline.activate_brushes();
  }
  else{
    global.multi_keyword_timeline.deactivate_brushes();
  }
});
