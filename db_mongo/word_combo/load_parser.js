var fsp = require('fs-promise');
var Parser = require("jison").Parser;
var path = require('path');
module.exports = exports = function load(){
  var file = path.join(global.__base, 'db_mongo', 'word_combo', 'grammar.jison');
  return fsp.readFile(file, {encoding:'utf8'}).then(function(grammar){
    var parser = new Parser(grammar);
    return Promise.resolve(parser);
  }).catch(function(err){
    console.log(err);
  });
}
