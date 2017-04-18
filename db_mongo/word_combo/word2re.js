var word2re_str = require('./word2re_str');
module.exports = exports = word2re;
function word2re(word){
  var re = new RegExp();
  var re_str = word2re_str(word);
  re.compile(re_str, 'i');
  return re;
}
