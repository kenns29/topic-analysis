var get_papers = require('../db_mongo/get_papers');
var topic_model = require('../mallet/topic_model');
module.exports = function(req, res){
  get_papers().then(function(data){
    topic_model.build(data);
  }).catch(function(err){
    console.log(err);
  });
};
