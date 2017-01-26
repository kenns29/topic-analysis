var conn_stat = require('./connection');
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');
module.exports = function(){
  return co(function*() {
    // Connection URL
    var url = conn_stat.url();
    // Use connect method to connect to the Server
    var db = yield MongoClient.connect(url);
    var coll = db.collection('sentence');
    coll.find({}).limit(100).toArray(function(err, docs){
      console.log(docs);
    });
    // Close the connection
    db.close();
  }).catch(function(err) {
    console.log(err.stack);
  });
};
