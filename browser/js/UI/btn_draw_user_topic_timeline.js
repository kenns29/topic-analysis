var $ = require('jquery');
var co = require('co');
var LoadUserTopicTimelineData = require('../load/load_user_topic_timeline_data');

module.exports = exports = $('#btn-draw-user-topic-timeline').click(function(e){
  co(function*(){
    var data = yield LoadUserTopicTimelineData().load();
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
});
