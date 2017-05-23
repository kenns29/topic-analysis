var co = require('co');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ConnStat = require('./db_mongo/connection'); // change the database to the local database

co(function*(){
  var db = yield MongoClient.connect(ConnStat().url());
  var col = db.collection('papers');
  yield fix(col, 'title_tokens');
  console.log('finished paper title tokens');
  yield fix(col, 'abstract_tokens');
  console.log('finished panel abstract tokens');
  col = db.collection('panels');
  yield fix(col, 'title_tokens');
  console.log('finished panel title tokens');
  yield fix(col, 'abstract_tokens');
  console.log('finished panel abstract tokens');
  db.close();
}).catch(function(err){
  console.log(err);
});

function fix(col, field){
  var find_query = {};
  var update_find_query = {};
  var update_set_query = {};
  find_query[field + '.lemma'] = {$regex: /\bwomen\b/, $options:'i'};
  update_find_query[field + '.lemma'] = {$regex: /\bwomen\b/, $options:'i'};
  update_set_query[field + '.$.lemma'] = 'woman';
  return co(function*(){
    var count = yield col.find(find_query).count();
    while(count > 0){
      yield col.updateMany(update_find_query,{$set:update_set_query});
      count = yield col.find(find_query).count();
    }
  }).catch(function(err){
    console.log(err);
  });
}
// function ConnStat(){
//   var host = 'mongodb://vaderserver0.cidse.dhcp.asu.edu';
//   var db = 'gender_study';
//   var ret = {};
//   ret.host = function(_){return arguments.length > 0 ? (host =_, ret):host;};
//   ret.db = function(_){return arguments.length > 0 ? (host =_, ret):host;};
//   ret.url = function(){return host + '/' + db;};
//   return ret;
// }
