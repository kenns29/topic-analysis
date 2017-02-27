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
function old_aggregate(){
  col.aggregate([
    {$match : {type : type}},
    {$project : {year : 1, title_tokens : 1}},
    {$group : {_id : '$year', count : {
      $sum : {
        $size : {
          $filter : {
            input : '$title_tokens',
            as : 'token',
            cond : {$eq :['$$token.lemma', keyword]}
          }
        }
      }
    }}},
    {$sort:{_id : 1}}
  ]).toArray();
}

var aggr = yield col.aggregate([
	{$unwind : '$title_tokens'},
	{$match : match},
	{$group : {_id : '$year', count : {$sum : 1}}},
	{$sort : {_id : 1}}
]).toArray();
