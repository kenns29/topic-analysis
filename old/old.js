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
function count2font_factory(extent){
  var scale = d3.scaleLinear().domain(extent).range([0, 50]);
  return function(count){
    var v = scale(count);
    return text_scale(v);
  };
}
