var $ = require('jquery');
var train_topics = require('../load/train_topics');
var test_data = require('../test_data/topic_data');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  var num_topics = Number($('#input_num_topics').val());
  var num_iterations = Number($('#input_num_iterations').val());
  // train_topics().then(function(data){
  //   global.topic_viewer.data(data).update();
  // });
  topic_viewer.data(test_data).update();
});
