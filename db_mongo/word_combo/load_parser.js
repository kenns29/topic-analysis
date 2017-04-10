var fsp = require('fs-promise');
var Parser = require("jison").Parser;

modulue.exports = exports = function load(){
  return fsp.readFile('grammar.jison', {encoding:'utf8'}).then(function(grammar){
    var parser = new Parser(grammar);
    return Promise.resolve(parser);
  }).catch(function(err){
    console.log(err);
  });
}
