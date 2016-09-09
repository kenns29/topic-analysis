var javaInit = require('../java/javaInit');
var java = javaInit.getJavaInstance();

var props = java.newInstanceSync('java.util.Properties');
props.setPropertySync("annotators", "tokenize, ssplit,pos,lemma, ner,parse");
var pipeline = java.newInstanceSync('edu.stanford.nlp.pipeline.StanfordCoreNLP', props);

module.exports = pipeline;
