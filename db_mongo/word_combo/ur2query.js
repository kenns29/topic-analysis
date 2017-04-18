var ur2parsed = require('./ur2parsed');
var parsed2query = require('./parsed2query');
module.exports = exports = ur2query;
function ur2query(ur, parser, token_field){
  var parsed = ur2parsed(ur, parser);
  return parsed2query(parsed, token_field);
}
