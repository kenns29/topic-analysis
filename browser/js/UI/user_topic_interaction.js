var $ = require('jquery');
var user_topic_controls = require('./user_topic_controls');
var update_timeline = global.controller_user_topics.update_timeline;
function change(e){
  var selected_model = global.user_model_stats_display.selected_model();
  if(selected_model && selected_model.hasOwnProperty('name')){
    let name = selected_model.name;
    update_timeline(name);
  }
}
$('#user-topic-control-div #select-level').change(change);
$('#user-topic-control-div #select-type').change(change);
$('#user-topic-control-div #select-field').change(change);
$('#user-topic-control-div #select-metric').change(change);
$('#user-topic-control-div #checkbox-keyword-timeline-percent').change(change);
