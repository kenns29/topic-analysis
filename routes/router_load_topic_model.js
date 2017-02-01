var TopicModel = require('../mallet/topic_model');
module.exports = exports = function(req, res){
  var name = req.query.name;
  var topic_model = TopicModel().load(name);
  res.json(topic_model.get_topics_with_id(10));
};