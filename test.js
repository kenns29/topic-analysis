/*
* Test code for node java
*/
var java = require('java');
var fs = require('fs');
java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");

java.classpath.push("./jars/Test.jar");
java.classpath.push("./jars/nlptoolkit.jar");
console.log('java.classpath', java.classpath);
var Test = java.import('Test');
console.log('hello', new Test().printSync());
var StanfordParser = java.import("nlp.edu.asu.vader.parser.StanfordParser");
var StanfordCoreNLP = java.import('edu.stanford.nlp.pipeline.StanfordCoreNLP');
var Properties = java.import('java.util.Properties');
var props = new Properties();
props.setPropertySync("annotators", "tokenize, ssplit,pos,lemma, ner,parse");
var pipeline = new StanfordCoreNLP(props);
var list1 = java.newInstanceSync('java.util.ArrayList');
console.log(list1.sizeSync());
list1.addSync('item1');
list1.addSync(1);
console.log(list1.sizeSync());
for(var i = 0; i < list1.sizeSync(); i++){
	console.log(list1.getSync(i));
}


// var dependencies = fs.readdirSync(baseDir);
 
// dependencies.forEach(function(dependency){
// 	console.log('dependency', dependency);
//     java.classpath.push(baseDir + "/" + dependency);
// });
