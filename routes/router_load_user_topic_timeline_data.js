var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
var KeywordTimelineFlags = require('../flags/keyword_timeline_flags');
var str2boolean = require('./str2boolean');

module.exports = exports = load;
function load(){
  return function(req, res){
    var type = Number(req.query.type);
    var level = Number(req.query.level);
    var percent = str2boolean(req.query.percent);
    var metric = Number(req.query.metric);
    var col_name = level === DOC.PN ? 'panels' : 'papers';
    var min_year = KeywordTimelineFlags.MIN_YEAR;
    var max_year = KeywordTimelineFlags.MAX_YEAR;
    var year2index = function(year){return year - min_year;};
    var index2year = function(index){return min_year + index;};

    co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var topic_col = db.collection('user_topics');
      var col = db.collection(col_name);
      var model = yield topic_col.findOne({name:'test'});
      var topics = model.topics;

      var json = [];
      for(let i = 0; i < topics.length; i++){
        let topic = topics[i];
        let aggr = yield col.aggregate(count_aggr(topic.words, type, metric)).toArray();
        let data_array = Array(max_year - min_year + 1);
        for(let i = 0; i < data_array.length; i++)data_array[i] = {year:index2year(i),count:0};
        for(let i = 0; i  < aggr.length; i++){
          let dat = aggr[i];
          data_array[year2index(dat._id)].count = (dat ? dat.count : 0);
        }
        json.push({
          id : topic.name,
          data : data_array
        });
      }
      res.json(json);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}

function count_aggr(words, type, metric){
  var match = {$and : []};
  match.$and.push(words_query(words));
  if(type >= 0) match.$and.push({'type':type});
  return [
    {$match : match},
    {$unwind : '$title_tokens'},
    {$group : {_id : '$id', year: {$last : '$year'}}},
    {$group : {_id : '$year', count : {$sum : 1}}},
    {$sort : {_id : 1}}
  ];
}

function words_query(words){
  var $or = [];
  words.forEach(function(word){
    var re = new RegExp();
    re.compile('\\b'+word+'\\b', 'i');
    $or.push({
      'title_tokens.lemma' : re
    });
  });
  return {$or:$or};
}
