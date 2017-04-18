var plain2ur = require('./plain2ur');
var ur2hr = require('./ur2hr');
var ur2plain = require('./ur2plain');
var hr2ur = require('./hr2ur');
var ur2parsed = require('./ur2parsed');
var parsed2query = require('./parsed2query');
var hr2query = require('./hr2query');
var ur2query = require('./ur2query');
var grammar = require('./grammar.json');
var Parser = require("jison").Parser;
module.exports = exports = word_combo;

function word_combo(){
  var parser = new Parser(grammar);
  var token_field = 'title_tokens.lemma';
  function ret(){}
  ret.ur2hr = ur2hr;
  ret.ur2plain = ur2plain;
  ret.hr2ur = hr2ur;
  ret.plain2ur = plain2ur;
  ret.ur2parsed = function(ur){return ur2parsed(ur, parser);};
  ret.parsed2query = parsed2query;
  ret.hr2query = function(hr){return hr2query(hr, parser, token_field);};
  ret.ur2query = function(ur){return ur2query(ur, parser, token_field);};
  ret.parser = function(){return parser;}
  ret.token_field = function(_){return arguments.length > 0 ? (token_field = _, ret) : token_field;};
  return ret;
}
