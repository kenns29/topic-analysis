var get_papers = require('../db_mongo/get_papers');
var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  var name = req.query.name;
  var num_topics = Number(req.query.num_topics);
  var num_iterations = Number(req.query.num_iterations);
  get_papers().then(function(data){
    topic_model.num_iterations(num_iterations).num_topics(num_topics);
    topic_model.build(data);
    topic_model.serialize(name);
    var json = topic_model.get_topics_with_id(10);
    res.json(json);
  }).catch(function(err){
    console.log(err);
  });
};
