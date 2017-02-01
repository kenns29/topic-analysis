var conn_stat = require('./connection');
var co = require('co');
var mongodb = require('mongodb');
module.exports = function(){
  var mongo_client = mongodb.MongoClient;
  var url = conn_stat.url();
  var data;
  function ret(){
    return co(function*(){
      var db = yield mongo_client.connect(url);
      var col = db.collection('papers');
      var data = yield col.find({}).toArray();
      return Promise.resolve(data);
    }).catch(function(err){
      console.log(err);
    });
  }
  ret.data = function(){return data;};
  return ret;
};
