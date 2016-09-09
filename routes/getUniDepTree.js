var stanfordCoreNLP = require('../nlp/stanfordCoreNLP');
var stanfordParser = require('../nlp/stanfordParser');
stanfordParser.setCoreNLPInstance(stanfordCoreNLP);

module.exports = function(data){
	stanfordParser.annotate(data);
	return stanfordParser.uniDepTree();
};
