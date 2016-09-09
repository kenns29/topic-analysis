var javaInit = require('../java/javaInit');
var java = javaInit.getJavaInstance();


function setCoreNLPInstance(pipeline){
	this.setPipelineSync(pipeline);
};

module.exports = java.newInstanceSync('nlp.edu.asu.vader.parser.StanfordParser');

module.exports.setCoreNLPInstance = setCoreNLPInstance;
module.exports.annotate = function(data){
	this.annotateSync(data);
};

module.exports.uniDepTree = function(){
	return JSON.parse(this.uniDepJsonSync());
};