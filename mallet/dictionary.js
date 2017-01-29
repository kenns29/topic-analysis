var serializer = require('../nlptoolkit/serializer');
//this is an associative array that stores the {id,token,lemma}
var dict = [];
var dict_java;

function serialize(name){
  serializer.serialize(dict_java, name);
  return this;
}
function deserialize(name){
  dict_java = serializer.deserialize(name);
  return this;
}
module.exports.dict = dict;
module.exports.serialize = serialize;
module.exports.deserialize = deserialize;
module.exports.dict_java = function(_){return arguments.length > 0?(dict_java =_,this):dict_java;};
module.exports.dict = function(_){return arguments.length > 0 ? (dict =_, this):dict;};
