module.exports.keywords_query = function keywords_query(keywords){
  or_array = keywords.map(function(keyword){
    return {'lemma' : {$regex : keyword, $options : 'i'}};
  });
  return {$elemMatch : {$or : or_array}};
};
