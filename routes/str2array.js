module.exports = exports = function(str){
  var arr = [];
  if(str) arr = str.split(',').map(function(d){return d.trim();});
  return arr;
};
