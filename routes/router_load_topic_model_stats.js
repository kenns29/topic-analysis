var fsp = require('fs-promise');
var TopicModel = require('../mallet/topic_model');
module.exports = exports = function(req, res){
  fsp.readdir('./models').then(function(files){
    var model_stats = [];
    files.forEach(function(file){
      var topic_model = TopicModel();
      topic_model.load(file);
      model_stats.push({
        name : file,
        num_topics : topic_model.num_topics()
      });
    });
    return Promise.resolve(model_stats);
  }).catch(function(err){
    console.log(err);
  }).then(function(model_stats){
    res.json(model_stats);
  });
};
