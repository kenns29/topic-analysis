var ConnStat = require('./connection');
var co = require('co');
var mongodb = require('mongodb');
var DOC = require('../flags/doc_flags');
module.exports = exports = function(){
  var mongo_client = mongodb.MongoClient;
  var url = ConnStat().url();
  var data;
  var year = 1979;
  var type = DOC.A;
  var level = DOC.P;
  function ret(){
    return co(function*(){
      var db = yield mongo_client.connect(url);
      var col = db.collection('papers');
      var data = yield col.find({year:year}).toArray();
      db.close();
      return Promise.resolve(data);
    }).catch(function(err){
      console.log(err);
    });
  }
  ret.data = function(){return data;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  return ret;
};
