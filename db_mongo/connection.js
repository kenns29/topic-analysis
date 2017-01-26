module.exports.host = 'mongodb://vaderserver0.cidse.dhcp.asu.edu';
module.exports.db = 'foresight'
module.exports.url = function(){
  return this.host + '/' + this.db;
};
