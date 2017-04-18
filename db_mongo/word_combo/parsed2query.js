var word2re = require('./word2re');
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
