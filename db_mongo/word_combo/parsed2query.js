module.exports = exports = parsed2query;
//not considering $not right now
function parsed2query(parsed, token_field){
  var ret = {};
  recurse(parsed, token_field, ret);
  return ret;
}

function recurse(parsed, token_field, parent){
  if(typeof parsed === 'object'){
    for(let key in parsed){
      if(parsed.hasOwnProperty(key)){
        let array = parsed[key];
        parent[key] = [];
        array.forEach(function(d, i){
          var obj = {}; parent[key].push(obj);
          recurse(d, token_field, obj);
        });
      }
    }
    return parsed;
  } else {
    parent[token_field] = word2re(parsed);
  }
}
function word2re(word){
  var re = new RegExp();
  if(word[0] == '%'){
    word = parsed.substring(1);
  } else {
    word = '\\b' + word;
  }
  if(word[word.length - 1] == '%'){
    word = word.substring(0, word.length-1);
  } else {
    word = word + '\\b';
  }
  re.compile(word, 'i');
  return re;
}
