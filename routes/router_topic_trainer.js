var get_papers = require('../db_mongo/get_papers');
var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  get_papers().then(function(data){
    topic_model.build(data);
    topic_model.serialize('model-1988');
    var json = topic_model.get_topics(10);
    res.json(json);
  }).catch(function(err){
    console.log(err);
  });
};
