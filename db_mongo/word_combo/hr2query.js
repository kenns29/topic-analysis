var hr2ur = require('./hr2ur');
var ur2parsed = require('./ur2parsed');
var parsed2query = require('./parsed2query');
module.exports = exports = hr2query;
function hr2query(hr, parser, token_field){
  var ur = hr2ur(hr);
  var parsed = ur2parsed(ur, parser);
  return parsed2query(parsed, token_field);
}
