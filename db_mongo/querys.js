module.exports.keywords_query = function keywords_query(keywords){
  or_array = keywords.map(function(d){
    return {'lemma' : {$regex : keyword, $options : 'i'}};
  });
  return {$elemMatch : {$or : or_array}};
};
