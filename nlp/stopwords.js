var path = require('path');
var fsp = require('fs-promise');
var co = require('co');
module.exports = exports = stopwords;
function stopwords(){
  function load(){
    var file = path.join(global.__base, 'mallet_resources', 'stoplists', 'en.txt');
    return co(function*(){
      var text = yield fsp.readFile(file, {encoding:'utf8'});
      var array = text.split(/\n|\r\n|\n\r|\r/);
      return Promise.resolve(new Set(array));
    }).catch(function(err){
      console.log(err);
    });
  }
  function ret(){return load();}
  ret.load = load;
  return ret;
};
