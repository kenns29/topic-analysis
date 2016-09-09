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
        var r; 
        var events = [];
        for(i = 0; i < trees.length; i++){
        	for(j = 0; j < trees[i].length; j++){
        		r = trees[i][j];
        		addParent(r);
        		events = events.concat(searchEvent(r, search_word, false));
        	}
        }

        console.log('events', events);

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

	/*
	* Search the node that matches the phrase in the tree
	*/
	function searchNode(r, phrase, isCaseSensitive){
		var re = isCaseSensitive ? new RegExp(phrase) : new RegExp(phrase, 'i');
		var nodes = [];
		recurse(r);
		return nodes;

		function recurse(r){
			if(r){
				if(r.token.match(re)){ 
					nodes.push(r);
				}
				r.children.forEach(function(child){
					recurse(child);
				});
			}
		}
	}

	/*
	* Search events in a tree
	*/
	function searchEvent(r, phrase, isCaseSensitive){
		var i, j, k;
		var nodes = searchNode(r, phrase, isCaseSensitive);
		console.log('nodes', nodes);
		var event;
		var events = [];
		for(i = 0; i < nodes.length; i++){
			if(event = nodeEvent(nodes[i]))
				events.push(event);
		}
		return events;
	}

	/*
	* find possible event surrounding the node
	*/
	function nodeEvent(node){
		var event = {
			'agent_clause' : {},
			'recipient_clause' : {},
			'verb_clause' : {}
		};
		var i, j, k;
		var n;
		var agent_node, recipient_node, verb_node;
		switch(node.edge_short_name){
			//nominal subject
			case 'nsubj' : 
				event.agent_clause.node = agent_node = node;
				event.verb_clause.node = verb_node = node.parent;
				
				for(i = 0; i < verb_node.children.length; i++){
					n = verb_node.children[i];
					if(n.edge_short_name === 'dobj'){
						event.recipient_clause.node = recipient_node =  n;
					}
					if(n.edge_short_name === 'advcl'){
						
					}
				}
				return event;
			//direct object
			case 'dobj' :
				event.recipient_clause.node = recipient_node = node;
				event.verb_clause.node = verb_node = node.parent;
				for(i = 0; i < node.parent.children.length; i++){
					n = node.parent.children[i];
					if(n.edge_short_name === 'nsubj'){
						event.agent_clause.node = agent_node = n;
						break;
					}
				}
				return event;

		}
		return null;
	}

});