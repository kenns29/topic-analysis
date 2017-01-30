var $ = require('jquery');
var train_topics = require('../load/train_topics');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  var num_topics = Number($('#input_num_topics').val());
  var num_iterations = Number($('#input_num_iterations').val());
  var loading = topic_viewer.loading();
  $(loading).show();
  train_topics.num_topics(num_topics)
  .num_iterations(num_iterations)
  .load().then(function(data){
    $(loading).hide();
    topic_viewer.data(data).update();
  });
});

function test(){
  var test_data = require('../test_data/topic_with_id_data');
  if(num_topics == 8)
    topic_viewer.data(test_data.eight).update();
  else if(num_topics == 10)
    topic_viewer.data(test_data.ten).update();
  else if(num_topics == 13)
    topic_viewer.data(test_data.thirteen).update();
}
