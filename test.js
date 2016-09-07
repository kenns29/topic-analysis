/*
* Test code for node java
*/
var java = require('java');
var fs = require('fs');
var list1 = java.newInstanceSync('java.util.ArrayList');
console.log(list1.sizeSync());
list1.addSync('item1');
list1.addSync(1);
console.log(list1.sizeSync());
for(var i = 0; i < list1.sizeSync(); i++){
	console.log(list1.getSync(i));
}

java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");

var baseDir = "./jars";
var dependencies = fs.readdirSync(baseDir);
 
dependencies.forEach(function(dependency){
	console.log('dependency', dependency);
    java.classpath.push(baseDir + "/" + dependency);
});

var parser = java.import('nlp.edu.asu.vader.parser.StanfordParser');