var co = require('co');
var $ = require('jquery');
var LoadTopicModel = require('../load/load_topic_model');
var DeleteTopicModel = require('../load/delete_topic_model');
module.exports = exports = controller;
function controller(){
  function select_model(selected_model){
    global.model_stats_display.selected_model(selected_model).d3models().filter(function(g){
      return g.id !== selected_model.id;
    }).select('.radio-td').select('.radio').select('input').each(function(){
      this.checked = false;
    });
    co(function*(){
      $(global.topic_viewer.loading()).show();
      var topics = yield LoadTopicModel().id(selected_model.id).load();
      $(global.topic_viewer.loading()).hide();
      yield global.topic_viewer.display_opt('weight').data(topics).update();
      var data = yield global.topic_document_viewer.year(selected_model.year)
        .type(selected_model.type).level(selected_model.level).load();
      global.topic_document_viewer.data(data).update();
    }).catch(function(err){
      console.log(err);
      $(global.topic_viewer.loading()).hide();
    });
  };
  function delete_model(selected_model){
    DeleteTopicModel().id(selected_model.id).load().then(function(status){
        var data = global.model_stats_display.data();
        let index = data.length;
        for(let i = 0; i < data.length; i++){
          if(data[i].id == selected_model.id){
            index = i;
            break;
          }
        }
        data.splice(index, 1);
        global.model_stats_display.update();
    }).catch(function(err){
      console.log(err);
      alert('did not delete the model successfully');
    });
  }
  var ret = {};
  ret.select_model = select_model;
  ret.delete_model = delete_model;
  return ret;
}
