var $ = require('jquery');
var train_topics = require('../load/train_topics');
module.exports = $('#btn-train-topics').click(function(){
  train_topics().then(function(){
    console.log('topic training finished');
  });
});
