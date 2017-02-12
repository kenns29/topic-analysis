var co = require('co');
module.exports = exports = function keyword_data_promise(data, keywords, token_field){
  return co(function*(){
    data.forEach(function(d){
      d[token_field].forEach(function(token){

      });
    });
    return Promise.resolve(data);
  });
};

function keyword_tokens(tokens, keywords){
  var keyword_tokens = [];
  tokens.forEach(function(d){
    
  });
}
