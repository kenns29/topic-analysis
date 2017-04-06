module.exports = exports = controller;
function controller(){
  function select_topic(topic){
    global.topic_document_viewer.scroll_to_topic(topic);
  }
  var ret = {};
  ret.select_topic = select_topic;
  return ret;
}
