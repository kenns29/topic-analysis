var $ = require('jquery');
var co = require('co');
var LoadUserTopicTimelineData = require('../load/load_user_topic_timeline_data');
var user_topic_controls = require('../UI/user_topic_controls');
module.exports = exports = controller;
function controller(){
  function update_timeline(){
    var flags = user_topic_controls.get_flags();
    return co(function*(){
      $(global.multi_user_topic_timeline.loading()).show();
      var data = yield LoadUserTopicTimelineData().type(flags.type).level(flags.level)
      .field(flags.field).percent(flags.percent).metric(flags.metric).load();
      $(global.multi_user_topic_timeline.loading()).hide();
      global.multi_user_topic_timeline.data(data).update();
    }).catch(function(err){
      console.log(err);
    });
  }
  var ret = {};
  ret.update_timeline = update_timeline;
  return ret;
}
