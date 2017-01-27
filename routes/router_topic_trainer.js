var get_papers = require('../db_mongo/get_papers');
var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  get_papers().then(function(data){
    topic_model.build(data);
    topic_model.serialize();
    topic_model.to_json();
  }).catch(function(err){
    console.log(err);
  });
};
