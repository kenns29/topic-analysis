var express = require('express');
var fs = require('fs');
var path = require('path');
var getUniDepTree = require('./getUniDepTree');

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/hello', function(req, res) {
	res.json('hello.');
});

/* GET the univeral depedency tree in json format given data*/
router.get('/loadunideptree', function(req, res){
	res.json(getUniDepTree(req));
});

router.get('/testunideptree', function(req, res){
	fs.readFile('test-data.txt', 'utf8', function(err, data){
		if(err){
			console.log('err reading file', err);
		}
		else{
			var tree = getUniDepTree(data);
			console.log('tree', tree);
			res.json(tree);
		}
	});
});
module.exports = router;