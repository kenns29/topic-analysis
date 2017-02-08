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
  function load(){
    return co(function*(){
      var db = yield mongo_client.connect(url);
      var col = db.collection('papers');
      var data = yield col.find({year:year,type:type}).toArray();
      db.close();
      return Promise.resolve(data);
    }).catch(function(err){
      console.log(err);
    });
  }
  function ret(){return load();}
  ret.data = function(){return data;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.load = load;
  return ret;
};
