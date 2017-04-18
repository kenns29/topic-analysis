var DOC = require('../flags/doc_flags');
var keywords_query = require('./query').keywords_query;
module.exports = exports = query_data;
function query_data(){
  var year = 1979;
  var type = DOC.A;
  var to_year = -1;
  var field = DOC.TITLE;
  var keywords = [];
  function make_query(){
    var token_field = field === DOC.ABSTRACT ? 'abstract_tokens' : 'title_tokens';
    var query = {};
    var and_map = new Map();
    if(year >= 0) and_map.set('year', year);
    if(type >= 0) and_map.set('type', type);
    if(to_year > 0) {
      and_map.set('year', {$gte:year,$lt:to_year});
    }
    if(keywords.length > 0){
      and_map.set('keyword', keywords_query(keywords, token_field + '.lemma'));
    }
    var and_array = [];
    for(let [key, value] of and_map){
      let obj = {};
      if(key != 'keyword') obj[key] = value;
      else obj = value;
      and_array.push(obj);
    }
    query.$and = and_array;
    return query;
  }
  function ret(){return make_query();}
  ret.make_query = make_query;
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.to_year = function(_){return arguments.length > 0 ?(to_year =_, ret) : to_year;};
  ret.field = function(_){return arguments.length > 0? (field=_, ret) : field;};
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  return ret;
}
