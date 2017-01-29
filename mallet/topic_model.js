var java = require('../java/java_init');
var dictionary = require('./dictionary');
var serializer = require('../nlptoolkit/serializer');
var TopicModel = 'nlp.edu.asu.vader.mallet.model.TopicModel';
var topicModel = java.newInstanceSync(TopicModel);
topicModel.setMalletStopwordsPathSync('./mallet_resources/stoplists/en.txt');
topicModel.setMalletStopPatternPathSync('./mallet_resources/stop_pattern.txt');
topicModel.setModelNumIterationSync(250);
topicModel.setNumTopicsSync(10);
function uri(d, i){
  return d.id;
}
function doc(d, i){
  return d.title;
}
function build(data){
  var uri_array = java.newInstanceSync('java.util.ArrayList');
  var doc_array = java.newInstanceSync('java.util.ArrayList');
  data.forEach(function(d, i){
    var uri_item = uri(d, i);
    var doc_item = doc(d, i);
    uri_array.addSync(uri_item);
    doc_array.addSync(doc_item);
  });
  topicModel.buildModelSync(uri_array, doc_array);
  return ret;
}
function get_topics(_){
  var num_words = 10;
  if(arguments.length > 0) num_words = arguments[0];
  var num_topics = topicModel.getNumTopicsSync();
  var topics = Array(num_topics);
  for(let i = 0; i < num_topics; i++){
    let topic_words = get_topic(i, num_words);
    topics[i] = topic_words;
  }
  return topics;
}
function get_topic(topic, _){
  var num_words = 10;
  if(arguments.length > 1) num_words = arguments[1];
  var topic_words = Array(num_words);
  var alphabet = topicModel.model.getAlphabetSync();
  var tokens = topicModel.model.getDataSync().getSync(0).instance.getDataSync();
  var topics = topicModel.model.getDataSync().getSync(0).topicSequence;
  var topWords = topicModel.model.getSortedWordsSync();
  var iterator = topWords.getSync(topic).iteratorSync();
  var rank = 0;
  var idSorter;
  var id, word, weight;
  while(iterator.hasNextSync() && rank < num_words){
    idSorter = iterator.nextSync();
    id = idSorter.getIDSync();
    word = alphabet.lookupObjectSync(id);
    weight = idSorter.getWeightSync();
    topic_words[rank++] = {token:word,weight:weight,id:id,index:rank};
  }
  return topic_words;
}
function serialize(name){
  serializer.serialize(topicModel, name);
  return ret;
}
function deserialize(name){
  topicModel = serializer.deserialize(name);
  return ret;
}
function ret(){return build();}
ret.build = build;
ret.uri = function(_){return arguments.length > 0 ? (uri =_, ret):uri;};
ret.doc = function(_){return arguments.length > 0 ? (doc =_, doc):doc;};
ret.serialize = serialize;
ret.deserialize = deserialize;
ret.num_topics = function(_){
  if(arguments.length > 0){
    topicModel.setNumTopicsSync(_);
  } else return topicModel.getNumTopicsSync();
};
ret.num_iteration = function(_){return arguments.length > 0 ? (topicModel.setModelNumIterationSync(_), ret): topicModel.getModelNumIterationSync();};
ret.get_topic = get_topic;
ret.get_topics = get_topics;
module.exports = ret;
