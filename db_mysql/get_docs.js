var mysql = require('mysql2');
var connection = require('./connection');
var conn = connection.database('literature_collections').connection();
function ret(callback){
  var query_str = "SELECT * FROM `predictive_va_only_some_journals`";
  conn.query(query_str, callback);
}
ret.conn = function(){return conn;};
module.exports = ret;
