var d3 = require('../load_d3');
var $ = require('jquery');

function topic_model_compare(){
  var container = '#model-compare-div';

  var ret = {};
  return ret;
}

function flatten_topics(models){
  var topics = [];
  models.forEach(function(model){
    model.topics.forEach(function(topic){
      topics.push({
        id : model.id + '-' + topic.id,
        model_id : model.id,
        topic_id : topic.id,
        type : model.type,
        field : model.field,
        year : model.year,
        tokens : topic.topic
      });
    });
  });
  return topics;
}
