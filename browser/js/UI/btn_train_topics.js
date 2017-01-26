var $ = require('jquery');
module.exports = $('#btn-train-topics').click(function(){
  $.ajax({
    url : service_url + '/topictrainer',
    data : {},
    dataType: 'json',
    success : function(data){
      console.log('data', data);
    }
  });
});
