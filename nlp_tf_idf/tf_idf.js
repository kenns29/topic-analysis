module.exports = exports = function(){
  var data;
  var field = 'title_tokens';
  var use_lemma = true;
  var return_json = true;
  //log weighted tf
  function calc_tf(data){
    var tf = [];
    var log_tf = [];
    data.forEach(function(d){
      let doc_terms = [];
      let tokens = d[field];
      tokens.forEach(function(token){
        let word = use_lemma ? token.lemma : token.text;
        if(!tf[word]) tf[word] = 0;
        ++tf[word];
      });
    });
    let log10 = Math.log(10);
    for(let word in tf){
      if(tf.hasOwnProperty(word) && isNaN(word)){
        let n = tf[word];
        log_tf[word] = 1 + Math.log(n) / log10;
      }
    }
    return log_tf;
  }
  //log weighted idf
  function calc_idf(data){
    var df = [];
    var idf = [];
    var N = data.length;
    data.forEach(function(d){
      let doc_terms = [];
      let tokens = d[field];
      tokens.forEach(function(token){
        let word = use_lemma ? token.lemma : token.text;
        if(!doc_terms[word]){
          doc_terms[word] = true;
          if(!df[word]) df[word] = 0;
          ++df[word];
        }
      });
    });
    let log10 = Math.log(10);
    for(let word in df){
      if(df.hasOwnProperty(word) && isNaN(word)){
        let n = df[word];
        idf[word] = Math.log(N / n) / log10;
      }
    }
    return idf;
  }
  //log weighted tf-idf
  function calc_tfidf(data){
    var tf = calc_tf(data);
    var idf = calc_idf(data);
    var tfidf = [];
    tf.forEach(function(t, word){
      tfidf[word] = tf[word] * idf[word];
    });
    for(let word in tf){
      if(tf.hasOwnProperty(word) && isNaN(word)){
        let n = tf[word];
        tfidf[word] = tf[word] * idf[word];
      }
    }
    return tfidf;
  }
  function calc_tfidf_json(data){
    var tfidf = calc_tfidf(data);
    var json = [];
    for(let word in tfidf){
      if(tfidf.hasOwnProperty(word) && isNaN(word)){
        let n = tfidf[word];
        json.push({word : word, tfidf:n});
      }
    }
    return json;
  }
  function calc(data){
    if(return_json) return calc_tfidf_json(data);
    else return calc_tfidf(data);
  }
  function ret(data){return calc(data);}
  ret.field = function(_){return arguments.length > 0 ? (data = _, ret) : data;};
  ret.use_lemma = function(_){return arguments.length > 0 ? (use_lemma = _, ret) : use_lemma;};
  ret.return_json = function(_){return arguments.length > 0 ? (return_json = _, ret) : return_json;};
  ret.calc = calc;
  return ret;
};
