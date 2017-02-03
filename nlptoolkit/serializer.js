var java = require('../java/java_init');
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
  function ret(){}
  ret.serialize = serialize;
  ret.deserialize = deserialize;
  ret.dir = function(_){return arguments.length > 0 ? (dir =_, this): dir;};
  return ret;
};
