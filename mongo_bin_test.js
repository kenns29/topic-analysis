var TopicModel = require('./mallet/topic_model');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var ConnStat = require('./db_mongo/connection');
var co = require('co');
var fsp = require('fs-promise');
var path = require('path');
var btoa = require('btoa');
var btoa = require('btoa');
store();

function store(){
  co(function*(){
    var name = 'model-1979';
    var file = yield fsp.readFile(path.join(__dirname, 'models', name));
    console.log('file type', typeof file, file);
    console.log('is buffer', Buffer.isBuffer(file));
    var topicModel = TopicModel().load_from_binary(file);

    var bin = topicModel.serializeBinary();
    var buffer = Buffer.from(bin);
    topicModel = TopicModel().load_from_binary(buffer);
    topicModel.topicModel().printModelSync();
    console.log('buffer', buffer);
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection('models');
    var bulk = col.initializeOrderedBulkOp();
    var binary = new mongodb.Binary(bin);
    bulk.find({name:name}).upsert().updateOne({
      name : name,
      model : binary
    });
    yield bulk.execute();

    var model = yield col.find({name : name}).toArray();

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
