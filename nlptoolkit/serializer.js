var java = require('../java/java_init');
var atob = require('atob');
var btoa = require('btoa');
module.exports = exports = function(){
  var dir = 'models';
  function serialize(obj, name){
    var serializer = java.newInstanceSync('nlp.edu.asu.vader.utils.Serializer');
    serializer.setUseResourcesSync(false);
    serializer.setDirSync(dir);
    serializer.serializeSync(obj, name);
  }
  function deserialize(name){
    var serializer = java.newInstanceSync('nlp.edu.asu.vader.utils.Serializer');
    serializer.setUseResourcesSync(false);
    serializer.setDirSync(dir);
    return serializer.deserializeSync(name);
  }
  function serializeBase64(obj){
    var serializer = java.newInstanceSync('nlp.edu.asu.vader.utils.Serializer');
    return serializer.serializeBase64Sync(obj);
  }
  function deserializeBase64(str){
    var serializer = java.newInstanceSync('nlp.edu.asu.vader.utils.Serializer');
    return serializer.deserializeBase64Sync(str);
  }
  function serializeBinary(obj){
    var str = serializeBase64(obj);
    return atob(str);
  }
  function deserializeBinary(binary){
    var str = btoa(binary);
    return deserializeBase64(str);
  }
  function ret(){}
  ret.serialize = serialize;
  ret.deserialize = deserialize;
  ret.serializeBinary = serializeBinary;
  ret.deserializeBinary = deserializeBinary;
  ret.serializeBase64 = serializeBase64;
  ret.deserializeBase64 = deserializeBase64;
  ret.dir = function(_){return arguments.length > 0 ? (dir =_, this): dir;};
  return ret;
};
