module.exports = exports = function(){
  var host = 'mongodb://vaderserver0.cidse.dhcp.asu.edu';
  var db = 'gender_study_test';
  var ret = {};
  ret.host = function(_){return arguments.length > 0 ? (host =_, ret):host;};
  ret.db = function(_){return arguments.length > 0 ? (db =_, ret):db;};
  ret.url = function(){return host + '/' + db;};
  return ret;
};
