var load_parser = require('./load_parser');
var plain2ur = require('./plain2ur');
var ur2hr = require('./ur2hr');
var ur2plain = require('./ur2plain');
var hr2hr = require('.hr2ur');

module.exports = exports = word_combo;

function word_combo(){
  var parser;
  function load(){
    return load_parser().then(function(p){
      parser = p;
      return Promise.resolve(parser);
    }).catch(function(err){
      console.log(err);
    });
  }
  function ret(){}
  ret.load = load;
  ret.ur2hr = ur2hr;
  ret.ur2plain = ur2plain;
  ret.hr2ur = hr2ur;
  ret.plain2ur = plain2ur;
  ret.parser = function(){return parser;}
  return ret;
}
