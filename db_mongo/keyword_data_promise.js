var co = require('co');
module.exports = exports = function keyword_data_promise(data, keywords, token_field){
  return co(function*(){
    data.forEach(function(d){
      let tokens = d[token_field];
      d.keyword_tokens = keyword_tokens(tokens, keywords);
    });
    return Promise.resolve(data);
  });
};

function keyword_tokens(tokens, keywords){
  var keyword_tokens = [];
  var key2keyword = [];
  keywords.forEach(function(keyword){
    key2keyword[keyword.toLowerCase()] = keyword;
  });
  tokens.forEach(function(d){
    if(key2keyword[d.lemma.toLowerCase()]) keyword_tokens.push(d);
  });
  return keyword_tokens;
}
