var $ = require('jquery');
module.exports = exports = $('#btn-draw-user-topic-timeline').click(function(e){
  global.controller_user_topics.update_timeline();
});
