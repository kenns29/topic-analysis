var $ = require('jquery');
var co = require('co');
var LoadUserTopicTimelineData = require('../load/load_user_topic_timeline_data');
var user_topic_controls = require('../UI/user_topic_controls');
var UploadUserTopics = require('../load/upload_user_topics');
var DeleteUserTopicModel = require('../load/delete_user_topic_model');

module.exports = exports = controller;
function controller(){
  function update_timeline(name){
    var flags = user_topic_controls.get_flags();
    return co(function*(){
      $(global.multi_user_topic_timeline.loading()).show();
      var data = yield LoadUserTopicTimelineData().type(flags.type).level(flags.level)
      .model_name(name).field(flags.field).percent(flags.percent).metric(flags.metric).load();
      $(global.multi_user_topic_timeline.loading()).hide();
      global.multi_user_topic_timeline.data(data).percent(flags.percent).update();
    }).catch(function(err){
      console.log(err);
    });
  }
  function selected_model(selected_model){
    global.user_model_stats_display.selected_model(selected_model).d3models().filter(function(g){
      return g.name !== selected_model.name;
    }).select('.radio-td').select('.radio').select('input').each(function(){
      this.checked = false;
    });
    update_timeline(selected_model.name);
  }
  function add_model(form){
    co(function*(){
      yield UploadUserTopics().form(form).post();
      var data = yield global.user_model_stats_display.load();
      global.user_model_stats_display.data(data).update();
    }).catch(function(err){
      if(err == 'DUP'){
        alert('Sorry, the model name already exists.')
      }
      console.log(err);
    });
  }
  function delete_model(name){
    co(function*(){
      yield DeleteUserTopicModel().model_name(name).load();
      var data = yield global.user_model_stats_display.load();
      global.user_model_stats_display.data(data).update();
    }).catch(function(err){
      alert('can not delete successfully');
      console.log(err);
    });
  }
  var ret = {};
  ret.update_timeline = update_timeline;
  ret.selected_model = selected_model;
  ret.add_model = add_model;
  ret.delete_model = delete_model;
  return ret;
}
