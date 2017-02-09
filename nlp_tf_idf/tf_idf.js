
module.exports = exports = function(){
  var data;
  var field = 'title_tokens';
  var use_lemma = true;
  function calc_tf(data){
    var tf = [];
    data.forEach(function(d){
      let doc_terms = [];
      let tokens = d[field];
      tokens.forEach(function(token){
        let word = use_lemma ? token.lemma : token.text;
        if(!doc_terms[word]){
          doc_terms[word] = true;
          if(!tf[word]) tf[word] = 0;
          ++tf[word];
        }
      });
    });
    return tf;
  }
  function ret(){}
  return ret;
};
