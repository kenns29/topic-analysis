var $ = require('jquery');
var co = require('co');
var LoadUserTopicTimelineData = require('../load/load_user_topic_timeline_data');
module.exports = exports = controller;
function controller(){
  function update_timeline(){
    return co(function*(){
      $(global.multi_user_topic_timeline.loading()).show();
      var data = yield LoadUserTopicTimelineData().load();
      $(global.multi_user_topic_timeline.loading()).hide();
      console.log('data', data);
      global.multi_user_topic_timeline.data(data).update();
    }).catch(function(err){
      console.log(err);
    });
  }
  var ret = {};
  ret.update_timeline = update_timeline;
  return ret;
}
