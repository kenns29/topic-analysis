var KeywordSelectControls = require('../UI/keyword_select_controls');
var SafeLoad = require('../safe_load');
module.exports = exports = function(){
  var safe_load = SafeLoad();
  var keywords = [];
  var year = -1, to_year = -1;
  function ret(){}
  ret.update = function(){update(keywords, [year, to_year], safe_load);};
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.to_year = function(_){return arguments.length > 0 ? (to_year = _, ret) : to_year;};
  return ret;
};
function update(keywords, domain, safe_load){
  var flags = KeywordSelectControls.get_flags();
  var load = global.keyword_document_viewer.keywords(keywords)
  .year(domain[0]).to_year(domain[1])
  .type(flags.type).field(flags.field).level(flags.level).load;
  safe_load(load()).then(function(data){
    global.keyword_document_viewer.data(data).update();
  }).catch(function(err){
    console.log(err);
  });
}
