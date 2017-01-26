var mysql = require('mysql');
var host = 'vaderserver0.cidse.dhcp.asu.edu';
var user = 'hong';
var password = 'openpassword';
var config = {
  host : host,
  user : user,
  password : password,
  database : 'literature_collections'
};
var connection;
function ret(){create();}
function create(){return connection = mysql.createConnection(config);};
ret.database = function(_){
  return arguments.length > 0 ? (config.database =_, create(), ret) : config.database;
};
ret.create = create;
ret.config = function(_){return arguments.length > 0 ? (config =_, ret) : config;};
ret.connection = function(){return connection;};
module.exports = ret;
