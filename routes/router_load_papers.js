var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var model_col = require('../db_mongo/model_col');
var DOC = require('../flags/doc_flags');
var model_data_promise = require('../db_mongo/model_data_promise');
module.exports = exports = function(req, res){
  var model_id = Number(req.query.model_id);
  var field = Number(req.query.field);
  var year = Number(req.query.year);
  var to_year = Number(req.query.to_year); if(!to_year) to_year = -1;
  var type = Number(req.query.type);
  var keywords = [];
  var keywords_str = req.query.keywords;
  if(keywords_str) keywords = keywords_str.split(',');
  var get_papers = GetPapers().year(year).to_year(to_year).keywords(keywords).type(type);
  var token_field = field === DOC.TITLE ? 'title_tokens' : 'abstract_tokens';
  get_papers().then(function(data){
    if(model_id) return model_data_promise(data, model_id, token_field);
    else return Promise.resolve(data);
  }).then(function(data){
    res.json(data);
  }).catch(function(err){
    console.log(err);
    res.send(err);
  });
};
