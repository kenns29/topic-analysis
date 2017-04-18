var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
var KeywordTimelineFlags = require('../flags/keyword_timeline_flags');
var str2boolean = require('./str2boolean');
var WordCombo = require('../db_mongo/word_combo');
module.exports = exports = function(req, res){
  var keyword = req.query.keyword;
  var type = Number(req.query.type);
  var level = Number(req.query.level);
  var percent = str2boolean(req.query.percent);
  var metric = Number(req.query.metric);
  var col_name = level === DOC.PN ? 'panels' : 'papers';
  co(function*(){
    var db = yield MongoClient.connect(ConnStat().url());
    var col = db.collection(col_name);
    var aggr = yield col.aggregate(count_aggr(keyword, type, metric)).toArray();
    var min_year = KeywordTimelineFlags.MIN_YEAR;
    var max_year = KeywordTimelineFlags.MAX_YEAR;
    var year2index = function(year){return year - min_year;};
    var index2year = function(index){return min_year + index;};
    var data_array = Array(max_year - min_year + 1);
    for(let i = 0; i < data_array.length; i++)data_array[i] = {year:index2year(i),count:0};
    for(let i = 0; i  < aggr.length; i++){
      let dat = aggr[i];
      data_array[year2index(dat._id)].count = (dat ? dat.count : 0);
    }
    if(percent){
      let aggr = yield col.aggregate(total_aggr(type, metric)).toArray();
      let year2total = [];
      aggr.forEach(function(d){year2total[d._id] = d.count;});
      data_array.forEach(function(d){
        let total = year2total[d.year];
        d.percent = total ? d.count / total : 0;
        d.total = total ? total : 0;
      });
    }
    db.close();
    var data = {
      id : keyword,
      data : data_array
    };
    res.json(data);
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};

function count_aggr(keyword, type, metric){
  var match = {$and : []};
  var keyword_query = WordCombo().hr2query(keyword);
  match.$and.push(keyword_query);
  // var match = {'title_tokens.lemma' : {
  //   $regex : keyword, $options : 'i'
  // }};
  if(type >= 0) match.$and.push({'type':type});
  if(metric === KeywordTimelineFlags.METRIC_DOCUMENT){
    return [
      {$match : match},
      {$unwind : '$title_tokens'},
      {$group : {_id : '$id', year: {$last : '$year'}}},
      {$group : {_id : '$year', count : {$sum : 1}}},
      {$sort : {_id : 1}}
    ];
  } else {
    return [
      {$match : match},
      {$unwind : '$title_tokens'},
      {$group : {_id : '$year', count : {$sum : 1}}},
      {$sort : {_id : 1}}
    ];
  }
}
function total_aggr(type, metric){
  var match = {};
  if(type >= 0) match.type = type;
  if(metric === KeywordTimelineFlags.METRIC_DOCUMENT){
    return [
      {$match : match},
      {$group : {_id : '$year', count : {$sum : 1}}},
      {$sort : {_id : 1}}
    ];
  } else {
    return [
      {$match : match},
      {$project : {year : 1, title_tokens : 1}},
      {$group : {_id : '$year', count : {
        $sum : {$size : '$title_tokens'}
      }}},
      {$sort:{_id : 1}}
    ];
  }
}
