var TopicModel = require('./mallet/topic_model');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var ConnStat = require('./db_mongo/connection');
var co = require('co');
var fsp = require('fs-promise');
var path = require('path')
store();

function store(){
  co(function*(){
    var name = 'model-1979';
    var file = yield fsp.readFile(path.join(__dirname, 'models', name));
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection('bin_test');
    var bulk = col.initializeOrderedBulkOp();
    var bin = new mongodb.Binary(file);
    bulk.find({name:name}).upsert().updateOne({
      name : name,
      model : bin
    });
    yield bulk.execute();
    db.close();
  }).catch(function(err){console.log(err);});
}

function load(){
  co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());

  }).catch(function(err){console.log(err);});
}

function byte(){
  
}
