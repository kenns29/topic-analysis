var KeywordSelectControls = require('../UI/keyword_select_controls');
module.exports = exports = function(){
  var keywords = [];
  function ret(){}
  ret.update_domain = function(domain){update_domain(keywords, domain);};
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  return ret;
};
function update_domain(keywords, domain){
  var flags = KeywordSelectControls.get_flags();
  global.keyword_document_viewer.keywords(keywords)
  .year(domain[0]).to_year(domain[1])
  .type(flags.type).field(flags.field).level(flags.level).load().then(function(data){
    global.keyword_document_viewer.data(data).update();
  });
}
module.exports.update_domain = update_domain;
