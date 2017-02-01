console.log('requiring conn stat');
module.exports.host = 'mongodb://vaderserver0.cidse.dhcp.asu.edu';
module.exports.db = 'gender_study'
module.exports.url = function(){
  return this.host + '/' + this.db;
};
