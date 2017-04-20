var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
var KeywordTimelineFlags = require('../flags/keyword_timeline_flags');
var str2boolean = require('./str2boolean');
var WordCombo = require('../db_mongo/word_combo');
var word_combo = WordCombo();
module.exports = exports = load;
function load(){
  return function(req, res){
    var keyword = req.query.keyword;
    var type = Number(req.query.type);
    var level = Number(req.query.level);
    var percent = str2boolean(req.query.percent);
    var metric = Number(req.query.metric);
    var col_name = level === DOC.PN ? 'panels' : 'papers';
    var hr = req.query.keyword;
    console.log('hr', hr);
    co(function*(){
      var query = word_combo.hr2query(hr);
      console.log('query', query);
      var min_year = KeywordTimelineFlags.MIN_YEAR;
      var max_year = KeywordTimelineFlags.MAX_YEAR;
      var year2index = function(year){return year - min_year;};
      var index2year = function(index){return min_year + index;};
      var data_array = Array(max_year - min_year + 1);
      for(let i = 0; i < data_array.length; i++)data_array[i] = {year:index2year(i),count:0};
      if(percent){
        data_array.forEach(function(d){
          d.percent = 0;
          d.total = 0;
        });
      }
      var data = {
        id : keyword,
        query : query,
        data : data_array
      };
      res.json(data);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
