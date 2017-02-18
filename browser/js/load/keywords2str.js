module.exports = exports = function(keywords){
  var keywords_str = '';
  if(keywords && keywords.length > 0){
    keywords_str = keywords.reduce(function(pre, cur){
      if(pre === '') return cur;
      else return pre + ',' + cur;
    }, '');
  }
  return keywords_str;
};
