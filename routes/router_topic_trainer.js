var get_papers = require('../db_mongo/get_papers');
var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  var num_topics = req.params.num_topics;
  var num_iterations = req.params.num_iterations;
  console.log('num_topics', num_topics, 'num_iterations', num_iterations);
  get_papers().then(function(data){
    topic_model.num_iterations(num_iterations).num_topics(num_topics);
    topic_model.build(data);
    topic_model.serialize('model-1988');
    var json = topic_model.get_topics(10);
    res.json(json);
  }).catch(function(err){
    console.log(err);
  });
};
