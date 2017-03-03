module.exports = exports = function(arr){
  var str = '';
  if(arr && arr.length > 0){
    str = arr.reduce(function(pre, cur){
      if(pre === '') return cur;
      else return pre + ',' + cur;
    }, '');
  }
  return str;
};
