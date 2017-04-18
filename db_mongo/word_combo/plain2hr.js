var plain2ur = require('./plain2ur');
var ur2hr = require('./ur2hr');
module.exports = exports = plain2hr;
function plain2hr(plain){
  var ur = plain2ur(plain);
  return ur2hr(ur);
}
