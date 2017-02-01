module.exports = function(req, res){
  var topic_model = require('../mallet/topic_model');
  var name = req.query.name;
  topic_model.load(name);
  res.json(topic_model.get_topics_with_id(10));
};
