var $ = require('jquery');
var TrainTopics = require('../load/train_topics');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  var num_topics = Number($('#input_num_topics').val());
  var num_iterations = Number($('#input_num_iterations').val());
  var name = 'model-' + $('#from-year').val();
  var loading = topic_viewer.loading();
  $(loading).show();
  TrainTopics().num_topics(num_topics)
  .num_iterations(num_iterations)
  .model_name(name)
  .load().then(function(data){
    $(loading).hide();
    topic_viewer.data(data).update();
    console.log('model training finished');
    return Promise.resolve('success');
  }).catch(function(err){
    console.log(err);
    $(loading).hide();
  }).then(function(){
    global.model_stats_display.load().then(function(data){
      global.model_stats_display.data(data).update();
    });
    console.log('loading model stats');
    $(loading).hide();
  }).catch(function(err){
    console.log(err);
    $(loading).hide();
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
