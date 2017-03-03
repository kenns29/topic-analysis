
module.exports = exports = topic_compare;
function topic_compare(){
  function sim(t1, t2){
    return set_similarity(t1, t2);
  }
  function ret(t1, t2){return sim(t1, t2);}
  ret.sim = sim;
  return ret;
}


function set_similarity(t1, t2){
  var count = 0;
  var t2set = new Set(t2.map(token));
  for(let i = 0; i < t1.length; i++){
    if(t2set.has(token(t1[i]))) ++count;
  }
  var l = Math.max(t1.length, t2.length);
  return l>0?count/l:0;
}

function token(d){
  return d.token;
}
