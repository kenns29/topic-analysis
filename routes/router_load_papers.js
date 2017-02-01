var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
module.exports = exports = function(req, res){
  var model_name = req.query.model_name;
  var get_papers = GetPapers();
  get_papers().then(function(data){
    if(model_name){
      let topic_model = TopicModel().load(model_name);
      let id2distr = topic_model.id2distr();
      data.forEach(function(d){
        d.topic_distr = id2distr[d.id];
      });
      res.json(data);
    } else res.json(data);
  }).catch(function(err){
    console.log(err);
  });
};
