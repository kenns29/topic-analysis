var $ = require('jquery');
var train_topics = require('../load/train_topics');
var test_data = require('../test_data/topic_data');
module.exports = $('#btn-train-topics').click(function(){
  // train_topics().then(function(data){
  //   console.log('topic training finished', JSON.stringify(data, null, 2));
  //   global.topic_viewer.data(data).update();
  // });
  global.topic_viewer.data(test_data).update();
});
