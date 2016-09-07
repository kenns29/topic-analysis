/*
* Test code for node java
*/
var java = require('java');
var list1 = java.newInstanceSync('java.util.ArrayList');
console.log(list1.sizeSync());
list1.addSync('item1');
list1.addSync(1);
console.log(list1.sizeSync());
for(var i = 0; i < list1.sizeSync(); i++){
	console.log(list1.getSync(i));
}