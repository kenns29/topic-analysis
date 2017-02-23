var GetPapers = require('../db_mongo/get_papers');
var GetPanels = require('../db_mongo/get_panels');
var co = require('co');
var ConnStat = require('../db_mongo/connection');
var DOC = require('../flags/doc_flags');
var DIRECTION = require('../flags/word_tree_direction_flags');
var WordTree = require('../nlp_word_tree/word_tree');
var co = require('co');
module.exports = exports = function(req, res){
  var field = Number(req.query.field);
  var year = Number(req.query.year); if(!year) year = -1;
  var to_year = Number(req.query.to_year); if(!to_year) to_year = -1;
  var type = Number(req.query.type); if(!type) type = -1;
  var level = Number(req.query.level);
  var direction = Number(req.query.direction);
  var root_word = req.query.root_word;
  var use_stopwords = req.query.use_stopwords;
  if(use_stopwords == 'true') use_stopwords = true;
  else use_stopwords = false;
  if(root_word === '') {res.json(null); return;};
  var get_fun = level === DOC.PN ? GetPanels() : GetPapers();
  get_fun.year(year).to_year(to_year).type(type);
  var token_field = field === DOC.TITLE ? 'title_tokens' : 'abstract_tokens';
  co(function*(){
    var data = yield get_fun();
    var word_tree = WordTree().root_word(root_word);
    if(direction === DIRECTION.FORWARD) word_tree.reverse(false).create(data);
    else if(direction === DIRECTION.REVERSE) word_tree.reverse(true).create(data);
    res.json(word_tree.root());
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
