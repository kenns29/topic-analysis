var co = require('co');
var word_combo = require('./word_combo')();
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
  var re = new RegExp();
  var re_str = '';
  keywords.forEach(function(hr){
    var ur = word_combo.hr2ur(hr);
    var words = ur.split(/[&\/\(\)]/);
    words.forEach(function(keyword){
      if(keyword.match('%')){
        if(re_str === ''){
          re_str += word_combo.word2re_str(keyword);
        } else {
          re_str += '|' + word_combo.word2re_str(keyword);
        }
      } else {
        key2keyword[keyword.toLowerCase()] = keyword;
      }
    });
  });
  re.compile(re_str, 'i');
  tokens.forEach(function(d){
    if(key2keyword.hasOwnProperty(d.lemma.toLowerCase()))
      keyword_tokens.push(d);
    else if(re_str != '' && d.lemma.match(re)){
      keyword_tokens.push(d);
    }
  });
  return keyword_tokens;
}
