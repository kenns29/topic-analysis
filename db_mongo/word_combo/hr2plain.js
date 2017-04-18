var hr2ur = require('./hr2ur');
var ur2plain = require('./ur2plain');
module.exports = exports = hr2plain;
function hr2plain(hr){
  var ur = hr2ur(hr);
  return ur2plain(ur);
}
