var db_get = require('../db_mysql/get_docs');
module.exports = function(req, res){
  console.log('requesting');
  db_get.load();
};
