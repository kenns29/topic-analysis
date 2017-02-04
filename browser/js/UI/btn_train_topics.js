var $ = require('jquery');
var TrainTopics = require('../load/train_topics');
var topic_viewer = global.topic_viewer;
module.exports = $('#btn-train-topics').click(function(){
  var num_topics = Number($('#input_num_topics').val());
  var num_iterations = Number($('#input_num_iterations').val());
  var loading = $('#topic-model-display-loading');
  var year = global.UI_year_select.year();
  var name = 'model-' + year;
  loading.css('display', 'block');
  TrainTopics().num_topics(num_topics)
  .num_iterations(num_iterations)
  .year(year)
  .model_name(name)
  .load().then(function(data){
    console.log('data', data);
    return global.model_stats_display.load();
  }).then(function(data){
    loading.css('display', 'none');
    global.model_stats_display.data(data).update();
  }).catch(function(err){
    loading.css('display', 'none');
    console.log(err);
    if(err.responseText && err.responseText === 'NO_DATA')
      alert('There are no data for year ' + year);
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
