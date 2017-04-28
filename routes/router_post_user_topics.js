var ConnStat = require('../db_mongo/connection');
var co = require('co');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

module.exports = exports = post;
function post(passport){
  return function(req, res){
    var text = req.file.buffer.toString('utf8');
    co(function*(){
      var data = yield import_csv(text, 'test');
      res.json(data);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}

function import_csv(text, name){
  var json = csv2json(text);
  return co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection('user_topics');
    var has = yield col.findOne({name : name});
    if(has) return Promise.reject('DUP');
    var doc = {name : name, topics : json};
    yield col.insertOne(doc);
    return Promise.resolve(doc);
  });
}

function csv2json(text){
  var json = [];
  var lines = text.split(/\r\n|\n|\r/);
  lines.forEach(function(line){
    var array = line.split(/,/);
    var trimmed = [];
    for(let i = 0; i < array.length; i++){
      if(array[i] != '')trimmed.push(array[i]);
    }
    var title = trimmed[0];
    var words = trimmed.slice(1);
    json.push({
      name : title,
      words : words
    });
  });
  return json;
}