var get_docs = require('../db_mysql/get_docs');
function sampler(callback){
  console.log('in sampling');
  get_docs(function(err, data){
    var dat = data.slice(0, 100);
    callback(err, dat);
  });
}
module.exports = sampler;
