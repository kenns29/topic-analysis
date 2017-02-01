var $ = require('jquery');
var TrainTopics = require('../load/train_topics');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  var num_topics = Number($('#input_num_topics').val());
  var num_iterations = Number($('#input_num_iterations').val());
  var name = 'model-' + $('#from-year').val();
  var loading = $('#topic-model-display-loading');
  loading.css('display', 'block');
  TrainTopics().num_topics(num_topics)
  .num_iterations(num_iterations)
  .model_name(name)
  .load().then(function(data){
    return Promise.resolve('success');
  }).catch(function(err){
    console.log(err);
    loading.css('display', 'none');
  }).then(function(){
    return global.model_stats_display.load();
  }).catch(function(err){
    console.log(err);
    loading.css('display', 'none');
  })
  .then(function(data){
    loading.css('display', 'none');
    global.model_stats_display.data(data).update();
  }).catch(function(err){
    console.log(err);
    loading.css('display', 'none')
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
