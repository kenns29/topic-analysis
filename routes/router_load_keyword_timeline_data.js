var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
module.exports = exports = function(req, res){
  var keyword = req.query.keyword;
  var type = Number(req.query.type);
  var level = Number(req.query.level);
  var col_name = level === DOC.PN ? 'panels' : 'papers';
  co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection(col_name);
    var aggr = yield col.aggregate([
      {$match : {type : type}},
      {$project : {year : 1, title_tokens : 1}},
      {$group : {_id : '$year', count : {
        $sum : {
          $size : {
            $filter : {
              input : '$title_tokens',
              as : 'token',
              cond : {$eq :['$$token.lemma', keyword]}
            }
          }
        }
      }}}
    ]).toArray();
    db.close();
    res.send(aggr);
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
