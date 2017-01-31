var java = require('../java/java_init');
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
module.exports.serialize = serialize;
module.exports.deserialize = deserialize;
module.exports.dir = function(_){return arguments.length > 0 ? (dir =_, this): dir;};
