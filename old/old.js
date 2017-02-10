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
			res.json(tree);
		}
	});
});
