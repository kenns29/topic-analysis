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

var text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]);
var tiny_text_scale = d3.scaleThreshold()
.domain([ 1, 2, 3, 4, 5, 10, 20, 30, 40 ])
.range([ 0, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
  return d * 0.5;
}));


// document.getElementById('upload-user-topics')
// .addEventListener('change', upload, false);
//
// function upload(e){
//   var files = e.target.files;
//   let file;
//   console.log('change');
//   if(e.target.files.length === 0) return;
//   for(let i = 0; file = files[i]; i++){
//     let reader = new FileReader();
//     reader.onload = function(e){
//       var contents = e.target.result;
//       console.log('contents', contents);
//       var oReq = new XMLHttpRequest();
//       oReq.open("POST", "/usertopics", true);
//       oReq.onload = function(oEvent) {
//         if (oReq.status == 200) {
//           alert('uploaded');
//         } else {
//           alert('error');
//         }
//       };
//       oReq.setRequestHeader('Content-Type', 'text/plain');
//       oReq.send(contents);
//     };
//     reader.readAsText(file);
//   }
// }

// var $ = require('jquery');
// var service_url = require('../service');
// var form = document.forms.namedItem('user-topics');
// form.addEventListener('submit', function(ev){
//   var data = new FormData(data);
//   console.log('form data', data);
//   $.ajax({
//     url : service_url + '/usertopics',
//     method : 'POST',
//     data : new FormData(form),
//     cache : false,
//     contentType : false,
//     processData : false,
//     success : function(data){
//       console.log('post', data);
//     },
//     fail : function(jqXHR, textStatus, errorThrown){
//       console.log('jqXHR', jqXHR);
//       console.log('textStatus', textStatus);
//       console.log('errorThrown', errorThrown)
//     }
//   });
// });
