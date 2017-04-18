module.exports = exports = word2re_str;
function word2re_str(word){
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
  return word;
}
