var topic_model = require('../mallet/topic_model');
var topic_model_sampler = require('../mallet/topic_model_sampler');
module.exports = function(req, res){
  console.log('in training');
  topic_model_sampler(function(err, data){
    topic_model.build(data);
  });
};
