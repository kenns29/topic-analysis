var java = require('../java/java_init');
var TopicModel = 'nlp.edu.asu.vader.mallet.model.TopicModel';

var topicModel = java.newInstanceSync(TopicModel);
topicModel.setMalletStopwordsPathSync('./mallet_resources/stoplists/en.txt');
topicModel.setMalletStopPatternPathSync('./mallet_resources/stop_pattern.txt');

function uri(d, i){
  return Number(i).toString();
}
function doc(d, i){
  return d.abstract;
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
function ret(){return build();}
ret.build = build;
module.exports = ret;
