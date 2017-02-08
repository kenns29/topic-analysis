var java = require('../java/java_init');
var dictionary = require('./dictionary');
var Serializer = require('../nlptoolkit/serializer');
var co = require('co');
module.exports = function(){
  var serializer = Serializer();
  var TopicModel = 'nlp.edu.asu.vader.mallet.model.TopicModel';
  var topicModel;
  var id2index = [];
  var index2id = [];

  function init(){
    topicModel = java.newInstanceSync(TopicModel);
    topicModel.setMalletStopwordsPathSync('./mallet_resources/stoplists/en.txt');
    topicModel.setMalletStopPatternPathSync('./mallet_resources/stop_pattern.txt');
    topicModel.setModelNumIterationSync(250);
    topicModel.setNumTopicsSync(10);
    return ret;
  }
  function uri(d, i){
    return d.id.toString();
  }
  var doc = doc_factory('title_tokens');
  function doc_factory(field){
    return function(d, i){
      var text = '';
      var pre_end_pos = 0;
      for(let i = 0; i < d[field].length; i++){
        let token = d[field][i];
        if(pre_end_pos < token.begin_position){text += ' ';}
        text += token.lemma;
        pre_end_pos = token.end_position;
      }
      return text;
    };
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
    return co(function*(){
      yield topicModel.buildModelPromise(uri_array, doc_array);
      yield topicModel.makeNameIndexHashPromise();
      get_id_index_map();
    });
  }
  function get_id_pos_tokens(data, field){
    var id2pos2token = [];
    data.forEach(function(d){
      var pos2token = [];
      var text = '';
      var pre_end_pos = 0;
      for(let i = 0; i < d[field].length; i++){
        let token = d[field][i];
        let lemma_start_pos = text.length;
        if(pre_end_pos < token.begin_position){text += ' '; ++lemma_start_pos;}
        text += token.lemma;
        pos2token[lemma_start_pos] = token;
        pre_end_pos = token.end_position;
      }
      id2pos2token[d.id] = pos2token;
    });
    return id2pos2token;
  }
  function load(name){
    deserialize(name);
    topicModel.makeNameIndexHashSync();
    get_id_index_map();
    return ret;
  }
  function load_from_binary(binary){
    deserializeBinary(binary);
    topicModel.makeNameIndexHashSync();
    get_id_index_map();
    return ret;
  }
  function load_from_base64(base64){
    deserializeBase64(base64);
    topicModel.makeNameIndexHashSync();
    get_id_index_map();
    return ret;
  }
  function get_id_index_map(){
    id2index = [];
    index2id = [];
    var hashMap = topicModel.getNameIndexHashSync();
    var ids = hashMap.keySetSync();
    var iter = ids.iteratorSync();
    while (iter.hasNextSync()) {
      let id = iter.nextSync();
      let index = hashMap.getSync(id);
      id2index[id] = index;
      index2id[index] = id;
    }
  }
  function get_id_topic_distribution(){
    var id2distr = [];
    var model = topicModel.getModelSync();
    var topicAssignments = model.getDataSync();
    var size = topicAssignments.sizeSync();
    for(let i = 0; i < size; i++){
      let distr = model.getTopicProbabilitiesSync(i);
      id2distr[index2id[i]] = distr;
    }
    return id2distr;
  }
  function get_id_tokens(id2pos2token){
    var id2tokens = [];
    var model = topicModel.getModelSync();
    var alphabet = model.getAlphabetSync();
    var topicAssignments = model.getDataSync();
    var size = topicAssignments.sizeSync();
    for(let i = 0; i < size; i++){
      let topicAssignment = topicAssignments.getSync(i);
      let tokenTopicAssignments = topicModel.topicAssignment2TokenTopicTopicAssignmentListSync(topicAssignment);
      let tokensLength = tokenTopicAssignments.sizeSync();
      let tokens = Array(tokensLength);
      for(let j = 0; j < tokensLength; j++){
        let t = tokenTopicAssignments.getSync(j);
        let v = tokens[j] = {};
        let a;
        v.id = t.getTokenIndexSync();
        v.charindex = ((a = t.getCharindexSync()), [a[0], a[1]]);
        v.topic = t.getTopicSync();
        v.index = j;
        v.text = alphabet.lookupObjectSync(v.id);
        if(id2pos2token && id2pos2token[index2id[i]]){
          v.orig_token = id2pos2token[index2id[i]][v.charindex[0]];
        }
      }
      id2tokens[index2id[i]] = tokens;
    }
    return id2tokens;
  }
  function get_topics_with_id(_){
    var num_words = 10;
    if(arguments.length > 0) num_words = arguments[0];
    var json = get_topics(num_words);
    return json.map(function(d, i){return {
      id : i,
      topic : d
    };});
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
    var topic_words = [];
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
      topic_words.push({token:word,weight:weight,id:id,index:rank});
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
  function serializeBinary(){
    return serializer.serializeBinary(topicModel);
  }
  function deserializeBinary(binary){
    topicModel = serializer.deserializeBinary(binary);
    return ret;
  }
  function serializeBase64(){
    return serializer.serializeBase64(topicModel);
  }
  function deserializeBase64(str){
    topicModel = serializer.deserializeBase64(str);
    return ret;
  }
  function ret(){return build();}
  ret.topicModel = function(){return topicModel;};
  ret.build = build;
  ret.uri = function(_){return arguments.length > 0 ? (uri =_, ret):uri;};
  ret.doc = function(_){
    if(arguments.length > 0){
      if(typeof _ === 'function') doc = _;
      else if(typeof _ === 'string') doc = doc_factory(_);
      return ret;
    } else return doc;
  };
  ret.serialize = serialize;
  ret.deserialize = deserialize;
  ret.serializeBinary = serializeBinary;
  ret.deserializeBinary = deserializeBinary;
  ret.serializeBase64 = serializeBase64;
  ret.deserializeBase64 = deserializeBase64;
  ret.topicModel = function(){return topicModel;};
  ret.num_topics = function(_){
    if(arguments.length > 0){
      topicModel.setNumTopicsSync(_);
    } else return topicModel.getNumTopicsSync();
  };
  ret.num_iterations = function(_){return arguments.length > 0 ? (topicModel.setModelNumIterationSync(_), ret): topicModel.getModelNumIterationSync();};
  ret.get_topic = get_topic;
  ret.get_topics = get_topics;
  ret.get_topics_with_id = get_topics_with_id;
  ret.load = load;
  ret.load_from_binary = load_from_binary;
  ret.load_from_base64 = load_from_base64;
  ret.model_name = function(_){return arguments.length > 0 ? (topicModel.setNameSync(_), ret) : topicModel.getNameSync();};
  ret.id2distr = function(_){return get_id_topic_distribution();};
  ret.id2tokens = function(_){return get_id_tokens(_);};
  ret.id2pos2token = function(data, field){return get_id_pos_tokens(data, field);};
  return init();
};
