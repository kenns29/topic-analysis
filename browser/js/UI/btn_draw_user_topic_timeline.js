var $ = require('jquery');
var UserTopicControls = require('./user_topic_controls');
module.exports = exports = $('#btn-draw-user-topic-timeline').click(function(e){
  global.controller_user_topics.update_timeline('test');
});
