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
      {$unwind : '$title_tokens'},
      {$match : {type :type, 'title_tokens.lemma' : {
        $regex : keyword, $options : 'i'
      }}},
      {$group : {_id : '$year', count : {$sum : 1}}},
      {$sort : {_id : 1}}
    ]).toArray();

    db.close();
    var min_year = 1979;
    var max_year = 1989;
    var year2index = function(year){return year - min_year;};
    var index2year = function(index){return min_year + index;}
    var data_array = Array(max_year - min_year + 1);
    for(let i = 0; i < data_array.length; i++)data_array[i] = {year:index2year(i),count:0};
    for(let i = 0; i  < aggr.length; i++){
      let dat = aggr[i];
      data_array[year2index(dat._id)].count = dat.count;
    }
    var data = {
      id : keyword,
      data : data_array
    };
    res.send(data);
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
// function old_aggregate(){
//   col.aggregate([
//     {$match : {type : type}},
//     {$project : {year : 1, title_tokens : 1}},
//     {$group : {_id : '$year', count : {
//       $sum : {
//         $size : {
//           $filter : {
//             input : '$title_tokens',
//             as : 'token',
//             cond : {$eq :['$$token.lemma', keyword]}
//           }
//         }
//       }
//     }}},
//     {$sort:{_id : 1}}
//   ]).toArray();
// }
