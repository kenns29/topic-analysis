var co = require('co');
var bcrypt = require('bcrypt-nodejs');
var ConnStat = require('../db_mongo/connection');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
module.exports = exports = function(){
  var password, email, name, id;
  function find_by_email(email){
    return co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('users');
      var user = yield col.findOne({'local.email' : email});
      db.close();
      if(user){
        password = user.local.password;
        email = user.local.email;
        id = user._id;
        return Promise.resolve(ret);
      }
      else return Promise.resolve(null);
    }).catch(function(err){
      console.log(err);
    });
  }
  function find_by_id(id){
    return co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('users');
      var user = yield col.findOne({'_id' : id});
      db.close();
      if(user){
        password = user.local.password;
        email = user.local.email;
        id = user._id;
        return Promise.resolve(ret);
      }
      else return Promise.resolve(null);
    }).catch(function(err){
      console.log(err);
    });
  }
  function update(){
    return co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('users');
      var result = yield col.updateOne({'local.email' : email},
      {$set : {local : {email : email, password : generate_hash(password)}}},
      {upsert : true, w:1});
      var user = yield col.findOne({'local.email': email});
      id = user._id;
      db.close();
      return Promise.resolve(user);
    }).catch(function(err){
      console.log(err);
    });
  }
  function valid_password(_password){
    return bcrypt.compareSync(_password, password);
  }
  var ret = {};
  ret.password = function(_){return arguments.length > 0 ? (password = _, ret) : password;};
  ret.email = function(_){return arguments.length > 0 ? (email = _, ret) : email;};
  ret.name = function(_){return arguments.length > 0 ? (name = _, ret) : name;};
  ret.id = function(_){return arguments.length > 0 ? (id = _, ret) : id;};
  ret.generate_hash = function(){return generate_hash(password);};
  ret.valid_password = valid_password;
  ret.find_by_email = find_by_email;
  ret.find_by_id = find_by_id;
  ret.update = update;
  return ret;
};
module.exports.generate_hash = generate_hash;
function generate_hash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
