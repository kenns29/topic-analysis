var db_get = require('../db_mysql/get_docs');
module.exports = function(req, res){
  db_get(function(err, data){
    res.json(data);
    db_get.conn().end();
  });
};
