var java = require('../java/java_init');
module.exports = exports = function(){
  var props;
  var pipeline;
  var coref = false;
  var mention = false;
  var ner = true;
  var lemma = true;
  function make_props(){
    var props_str = "tokenize,ssplit,pos";
    if(lemma) props_str += ',lemma';
    if(ner) props_str += ',ner'
    if(mention) props_str += ',mention';
    if(coref) props_str += ',coref';
    props_str += ',parse';
    var props = java.newInstanceSync('java.util.Properties');
    props.setPropertySync("annotators", props_str);
    return props;
  }
  function reset(){
    props = make_props();
    pipeline = java.newInstanceSync('edu.stanford.nlp.pipeline.StanfordCoreNLP', props);
  }
  function init(){
    return (reset(), ret);
  }
  function ret(){return pipeline;}
  ret.pipeline = function(){return pipeline;};
  ret.coref = function(_){
    if(arguments.length  > 0){
      return coref = _, reset(), ret;
    } else return coref;
  };
  ret.mention = function(_){
    if(arguments.length  > 0){
      return mention = _, reset(), ret;
    } else return coref;
  };
  ret.ner = function(_){
    if(arguments.length  > 0){
      return ner = _, reset(), ret;
    } else return coref;
  };
  ret.lemma = function(_){
    if(arguments.length  > 0){
      return lemma = _, reset(), ret;
    } else return coref;
  };
  return init();
};
