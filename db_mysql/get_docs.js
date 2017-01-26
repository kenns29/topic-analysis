var mysql = require('mysql');
var connection = require('./connection');
var conn = connection
.database('literature_collections')
.connection();
function load(){
  console.log('database', connection.database());
  conn.connect();
  var query = "SELECT * FROM `predictive_va_only_some_journals`";
  conn.query(query, function (error, results, fields) {
    console.log('error', error);
    console.log(results);
  });
  conn.end();
}
function query_docs(){}
module.exports.load = load;
