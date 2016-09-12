function uni_dep_tree(input){
	var data = input;

	init();
	/*
	* initialization
	*/
	function init(){
		add_parent();
		collapse_compond();
		return tree;
	}
	/*
	* add parent
	*/
	function add_parent(){
		data.parent = null;
		recurse(data);
		return tree;
		function recurse(r){
			if(r){
				r.children.forEach(function(child){
					child.parent = r;
					recurse(child);
				})
			}
		}
	}

	/***************************
	* 	  mwe and compound     *
	****************************/
	function collapse_compond(){
		recurse(data);
		return tree;
		function recurse(r){
			collapse_compond_node(r);
			if(r) r.children.forEach(recurse);
		}
	}
	/*
	* Collapse compound and mwe(multi-word expression) children
	*/
	function collapse_compond_node(node){
		var nodes = [];
		var child;
		var i = node.children.length;
		while(i--){
			child = node.children[i];
			if(child.edge_short_name === 'mwe' || child.edge_short_name === 'compound'){
				nodes.push(node.children[i]);
				node.children.splice(i, 1);
			}
		}

		nodes.push(node);
		nodes = nodes.reverse();

		return merge_nodes(nodes);
	}

	/*
	* Merge multiple nodes into one, the properties of the merged node inherit the first node, 
	* and the positions are merged
	*/
	function merge_nodes(_){
		if(arguments.length === 0) return null;
		if(Object.prototype.toString.call(_) === '[object Array]')
			return merge_node_array(_)
		var i;
		var nodes = [];
		for(i = 0; i < arguments.length; i++){
			nodes.push(arguments[i]);
		}
		return merge_node_array(nodes);

		function merge_node_array(nodes){
			if(nodes.length === 0) return null;
			if(nodes.length === 1) return nodes[0];

			var head_node = nodes[0];
			var i, n, p;
			nodes.sort(function(a, b){
				return a.positions[0] - b.positions[0];
			});
 
			var merged_token;
			p = nodes[0];
			merged_token = p.token;

			for(i = 1; i < nodes.length; i++){
				n = nodes[i];
				if(p.positions[1] === n.positions[0])
					merged_token += n.token;
				else
					merged_token += ' ' + n.token;
				p = n;
			}

			head_node.token = merged_token;
			head_node.positions[0] = nodes[0].positions[0];
			head_node.positions[1] = nodes[nodes.length - 1].positions[1];

			return head_node;
		}
	}



	function extract_events(){

	}

	/*
	* 
	*/
	function node_op(node){
		if(node.tag.match('VB')){

		}

	}
	/* Triplet functions
	*
	*/


	var tree = {
		'data' : function(_){
			return arguments.length > 0 ? (data = _, this) : data;
		},
		'collapse_compond' : collapse_compond
	}; 

	return tree;
}