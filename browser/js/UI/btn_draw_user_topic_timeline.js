var $ = require('jquery');
var co = require('co');
var LoadUserTopicTimelineData = require('../load/load_user_topic_timeline_data');

module.exports = exports = $('#btn-draw-user-topic-timeline').click(function(e){
  co(function*(){
    $(global.multi_user_topic_timeline.loading()).show();
    var data = yield LoadUserTopicTimelineData().load();
    $(global.multi_user_topic_timeline.loading()).hide();
    console.log('data', data);
    global.multi_user_topic_timeline.data(data).update();
  }).catch(function(err){
    console.log(err);
  });
});
