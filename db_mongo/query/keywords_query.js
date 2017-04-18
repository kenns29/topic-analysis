var WordCombo = require('../word_combo');
module.exports = exports = keywords_query;
// function keywords_query(keywords){
//   or_array = keywords.map(function(keyword){
//     return {'lemma' : {$regex : keyword, $options : 'i'}};
//   });
//   return {$elemMatch : {$or : or_array}};
// };
function keywords_query(keywords, _token_field){
  var token_field = 'title_tokens.lemma';
  if(_token_field) token_field = _token_field;
  var or_array = keywords.map(function(hr){
    return WordCombo().token_field(token_field).hr2query(hr);
  });
  return {$or : or_array};
}
