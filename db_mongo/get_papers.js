var ConnStat = require('./connection');
var co = require('co');
var mongodb = require('mongodb');
var mongo_client = mongodb.MongoClient;
var DOC = require('../flags/doc_flags');
var QueryData = require('./query_data');
module.exports = exports = function(){
  var url = ConnStat().url();
  var data;
  var year = 1979;
  var type = DOC.A;
  var to_year = -1;
  var field = DOC.TITLE;
  var keywords = [];
  function load(){
    var query = QueryData().year(year).to_year(to_year)
    .field(field).keywords(keywords).type(type).make_query();
    return co(function*(){
      var db = yield mongo_client.connect(url);
      var col = db.collection('papers');
      var data = yield col.find(query).toArray();
      db.close();
      return Promise.resolve(data);
    }).catch(function(err){
      console.log(err);
    });
  };
  function ret(){return load();}
  ret.data = function(){return data;};
  ret.year = function(_){return arguments.length > 0 ? (year = _, ret) : year;};
  ret.type = function(_){return arguments.length > 0 ? (type = _, ret) : type;};
  ret.to_year = function(_){return arguments.length > 0 ?(to_year =_, ret) : to_year;};
  ret.field = function(_){return arguments.length > 0? (field=_, ret) : field;};
  ret.keywords = function(_){return arguments.length > 0 ? (keywords = _, ret) : keywords;};
  ret.load = load;
  return ret;
};
