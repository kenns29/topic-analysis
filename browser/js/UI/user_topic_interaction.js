var $ = require('jquery');
var user_topic_controls = require('./user_topic_controls');
var update_timeline = global.controller_user_topics.update_timeline;
$('#user-topic-control-div #select-level').change(update_timeline);
$('#user-topic-control-div #select-type').change(update_timeline);
$('#user-topic-control-div #select-field').change(update_timeline);
$('#user-topic-control-div #select-metric').change(update_timeline);
$('#user-topic-control-div #checkbox-keyword-timeline-percent').change(update_timeline);
