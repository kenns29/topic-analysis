var java = require('../java/java_init');
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
