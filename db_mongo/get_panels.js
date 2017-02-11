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
  var to_year = -1;
  function load(){
    var query = {};
    if(year >= 0) query.year = year;
    if(type >= 0) query.type = type;
    if(to_year > 0) query.year = {$gte:year,$lt:to_year};
    return co(function*(){
      var db = yield mongo_client.connect(url);
      var col = db.collection('panels');
      var data = yield col.find(query).toArray();
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
  ret.to_year = function(_){return arguments.length > 0 ?(to_year =_, ret) : to_year;};
  ret.load = load;
  return ret;
};
