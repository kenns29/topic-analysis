var plain2ur = require('./plain2ur');
var ur2hr = require('./ur2hr');
var ur2plain = require('./ur2plain');
var hr2ur = require('./hr2ur');
var ur2parsed = require('./ur2parsed');
var parsed2query = require('./parsed2query');
var hr2query = require('./hr2query');
var ur2query = require('./ur2query');
var plain2hr = require('./plain2hr');
var hr2plain = require('./hr2plain');
var word2re_str = require('./word2re_str');
var word2re = require('./word2re');
var grammar = require('./grammar.json');
var Parser = require("jison").Parser;
module.exports = exports = word_combo;

function word_combo(){
  var parser = new Parser(grammar);
  var token_field = 'title_tokens.lemma';
  function ret(){}
  ret.ur2hr = ur2hr;
  ret.ur2plain = ur2plain;
  ret.hr2plain = hr2plain;
  ret.hr2ur = hr2ur;
  ret.plain2ur = plain2ur;
  ret.plain2hr = plain2hr;
  ret.ur2parsed = function(ur){return ur2parsed(ur, parser);};
  ret.parsed2query = parsed2query;
  ret.hr2query = function(hr){return hr2query(hr, parser, token_field);};
  ret.ur2query = function(ur){return ur2query(ur, parser, token_field);};
  ret.parser = function(){return parser;}
  ret.token_field = function(_){return arguments.length > 0 ? (token_field = _, ret) : token_field;};
  ret.word2re = word2re;
  ret.word2re_str = word2re_str;
  return ret;
}
