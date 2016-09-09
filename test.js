/*
* Test code for node java
*/
var javaInit = require('./java/javaInit');
var java = javaInit.getJavaInstance();
var fs = require('fs');


// var props = java.newInstanceSync('java.util.Properties');
// props.setPropertySync("annotators", "tokenize, ssplit,pos,lemma, ner,parse");
var pipeline = require('./nlp/stanfordCoreNLP');
var stanfordParser = require('./nlp/stanfordParser');
stanfordParser.setCoreNLPInstance(pipeline);

fs.readFile('test-data.txt', 'utf8', function(err, data){
	if(err){
		console.log('err reading file', err);
	}
	else{
		console.log('data', data);
		stanfordParser.annotate(data);
		var trees = stanfordParser.uniDepTree();
		// trees.forEach(function(s){
		// 	s.forEach(function(r){
		// 		addParent(r);
		// 	});
		// });

		
		fs.writeFile('./test_output/tree.json', JSON.stringify(trees, null, 2), function(err){
			if(err) return console.log('err');
		});
	}
});

/*
* Add parent attribute for each node
*/
function addParent(r){
	recurse(r, null);
	function recurse(r, p){
		if(r){
			r.parent = p;
			r.children.forEach(function(child){
				recurse(child, r);
			});
		}
	}
}