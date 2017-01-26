var $ = require('jquery');
var d3 = require('./load_d3');
var uni_dep_tree_collection = require('./uni-dep-tree/uni_dep_tree_collection');
var joined_sem_tree_view = require('./uni-dep-tree/joined_sem_tree_view');
var service_url = require('./service');
$(document).ready(function(){
	var svg = d3.select('container').append('svg')
	.attr('width', 800)
	.attr('height', 600);

	var url = service_url + 'testunideptree';
	var config = {};

	var store = new Object();
	$.when(
		$.ajax({
			'url' : url,
			'data' : config,
			'dataType' : 'json',
			'success' : function(data, textStatus, jqXHR ){
				store.trees = data;
			},
			'error' : function(jqXHR, textStatus, errorThrown){
				console.log('textStatus', textStatus);
				 console.log('errorThrown', errorThrown);
			}
		})
	).then(function(){
		console.log('store.trees', store.trees);
		var i, j, k;
		svg.selectAll('.uni-dep-tree-g').remove();
		var margin = {top:10, bottom:10, right:10, left:10};
		var g = svg.append('g').attr('class', 'uni-dep-tree-g')
		.attr('transform', 'translate(' + [margin.left, margin.right] + ')');
        var search_word = 'Trump';
        var trees = store.trees;
        var udt_coll = uni_dep_tree_collection(trees);
        var sem_tree = udt_coll.join_sem_tree('trump');
        console.log('roles', udt_coll.flatten_sem_roles());
        console.log('collection', udt_coll.collection());
        console.log('sem_tree', sem_tree);
        joined_sem_tree_view(sem_tree).init().update();
	});
});
