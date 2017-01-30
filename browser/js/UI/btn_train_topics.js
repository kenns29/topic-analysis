var $ = require('jquery');
var train_topics = require('../load/train_topics');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  // var num_topics = Number($('#input_num_topics').val());
  // var num_iterations = Number($('#input_num_iterations').val());
  // train_topics.num_topics(num_topics)
  // .num_iterations(num_iterations)
  // .load().then(function(data){
  //   console.log('topics', JSON.stringify(data, null, 2));
  //   topic_viewer.data(data).update();
  // });
  var test_data = require('../test_data/topic_with_id_data');
  topic_viewer.data(test_data).update();
});
