var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  var name = req.query.name;
  console.log('name', name);
  topic_model.load(name);
  res.json(topic_model.get_topics_with_id());
};
