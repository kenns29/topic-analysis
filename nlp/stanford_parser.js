var java = require('../java/java_init');
module.exports = exports = function(){
	var parser;
	var pipeline;
	function init(){
		parser = java.newInstanceSync('nlp.edu.asu.vader.parser.StanfordParser');
		return ret;
	}
	function annotate(data){
		parser.annotateSync(data);
	}
	function uni_dep_tree(){
		return JSON.parse(parser.uniDepJsonSync());
	}
	function tokens(){
		var tokenList = parser.getTokensSync();
		var size = tokenList.sizeSync();
		var list = Array(size);
		var token;
		for(let i =0; i < size; i++){
			token = tokenList.getSync(i);
			list[i] = {};
			list[i].text = token.getTextSync();
			list[i].index = token.getIndexSync();
			list[i].sent_index = token.getSentIndexSync();
			list[i].index_in_sent = token.getIndexInSentSync();
			list[i].begin_position = token.getBeginPositionSync();
			list[i].end_position = token.getEndPositionSync();
			list[i].ner = token.getNerSync();
			list[i].lemma = token.getLemmaSync();
		}
		return list;
	}
	function ret(){}
	ret.pipeline = function(_){return arguments.length > 0 ? (pipeline = _, parser.setPipelineSync(pipeline), ret) : pipeline;};
	ret.annotate = annotate;
	ret.uni_dep_tree = uni_dep_tree;
	ret.init = init;
	ret.tokens = tokens;
	return init();
};
