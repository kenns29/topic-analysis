function uni_dep_tree(input){
	var data = input;

	init();
	/*
	* initialization
	*/
	function init(){
		add_parent();
		collapse_compond();
		mark_nodes();
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
			if(child.edge_short_name === 'mwe' 
				|| child.edge_short_name === 'compound' 
				|| child.edge_short_name === 'nmod:npmod' 
				|| child.edge_short_name === 'compound:prt'){
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
			var merged_lemma;
			p = nodes[0];
			merged_token = p.token;
			merged_lemma = p.lemma;

			for(i = 1; i < nodes.length; i++){
				n = nodes[i];
				if(p.positions[1] === n.positions[0]){
					merged_token += n.token;
					merged_lemma += n.lemma;
				}
				else{
					merged_token += ' ' + n.token;
					merged_lemma += ' ' + n.lemma;
				}
				p = n;
			}

			head_node.token = merged_token;
			head_node.lemma = merged_lemma;
			head_node.positions[0] = nodes[0].positions[0];
			head_node.positions[1] = nodes[nodes.length - 1].positions[1];

			return head_node;
		}
	}

	function find_roles(){
		var r = data;
		var roles = [];
		role_extractor(r, null, roles);
		return roles;

		function role_extractor(r, parent_stat, roles){
			var i, j, k;
			var evt, subj, obj, evt_mod, subj_mod, obj_mod;
			var child, cchild, ccchild;

			var subjs = [];
			var objs = [];
			var subj_mods = [];
			var obj_mods = [];

			/*
			* if the current node is an event
			*/
			if(r.type_set.has('evt')){
				/*
				* Check if the event is a verb, if not the cop of the word needs to be the event
				*/
				if(r.tag.match(/VB[A-Z]*/)){
					evt = r;
				}
				else{
					for(i = 0; i < r.children.length; i++){
						child = r.children[i];
						if(child.type_set.has('cop')){
							evt = child;
						}
					}
					objs.push(r);
				}

				//for all children of the event
				for(i = 0; i < r.children.length; i++){
					child = r.children[i];
					//if the child is a modifier, collapse the child and set it as the event modifier
					if(child.type_set.has('mod')){
						evt_mod = tree_to_nodes(child);
					}
					//if the child is a subject, add it to the subject array
					if(child.type_set.has('subj')){
						subjs.push(child);
						subj_mods.push(null);
						//add modifiers for the child
						for(j = 0; j < child.children.length; j++){
							cchild = child.children[j];
							//if the child has modifer, add modifer to the modifer array
							if(cchild.type_set.has('mod')){
								subj_mod = tree_to_nodes(cchild);
								subj_mods[subj_mods.length - 1] = subj_mod;
							}
							//if the child has conjunction, add conjunction to the subject array, along with its modifiers
							if(cchild.type_set.has('conj')){
								subjs.push(cchild);
								subj_mods.push(null);
								for(k = 0; k < cchild.children.length; k++){
									ccchild = ccchild.children[i];
									if(ccchild.type_set.has('mod')){
										subj_mod = tree_to_nodes(ccchild);
										subj_mods[subj_mods.length - 1] = subj_mod
									}
								}
							}
						}
					}
					//if the child is a object, add it to the object array
					if(child.type_set.has('obj')){
						objs.push(child);
						obj_mods.push(null);
						for(j = 0; j < child.children.length; j++){
							cchild = child.children[j];
							//if the child has modifier, add modifier to the modifier array
							if(cchild.type_set.has('mod')){
								obj_mod = tree_to_nodes(cchild);
								obj_mods[obj_mods.length - 1] = obj_mod;
							}
							//if the child has conjunctions, add conjunction to the object array, along with its modifiers
							if(cchild.type_set.has('conj')){
								objs.push(cchild);
								obj_mods.push(null);
								for(k = 0; i < ccchild; k++){
									ccchild = ccchild.children[i];
									if(ccchild.type_set.has('mod')){
										obj_mod = tree_to_nodes(ccchild);
										obj_mods[obj_mods.length - 1] = obj_mod;
									}
								}
							}
						}
					}
					//if the child is a conjunction, recursively extract the roles for the conjuction
					if(child.type_set.has('conj')){
						role_extractor(child, {
							'subjs' : subjs,
							'objs' : objs
						}, roles);
					}	
				}
				if(parent_stat){
					if(subjs.length === 0)
						subjs = parent_stat.subjs;
					if(objs.length === 0)
						objs = parent_stat.objs;
				}
			}

			/*
			* Append events to the role list
			*/
			for(i = 0; i < subjs.length; i++){
				for(j = 0; j < objs.length; j++){
					roles.push({
						'evt' : evt,
						'subj' : subjs[i],
						'obj' : objs[j],
						'evt_mod' : evt_mod,
						'subj_mod' : subj_mods[i],
						'obj_mod' : obj_mods[j]
					});
				}
			}
			if(subjs.length === 0){
				for(j = 0; j < objs.length; j++){
					roles.push({
						'evt' : evt,
						'subj' : null,
						'obj' : objs[j],
						'evt_mod' : evt_mod,
						'subj_mod' : null,
						'obj_mod' : obj_mods[j]
					});
				}
			}
			if(objs.length === 0){
				for(i = 0; i < subjs.length; i++){
					roles.push({
						'evt' : evt,
						'subj' : subjs[i],
						'obj' : null,
						'evt_mod' : evt_mod,
						'subj_mod' : subj_mods[i],
						'obj_mod' : null
					});
				}
			}
		}
		
	}

	function tree_to_role(r, role_string){
		return {
			'role' : role_string,
			'nodes' : tree_to_nodes(r)
		};
	}
	function tree_to_nodes(r){
		var nodes = [];
		recurse(r);
		nodes.sort(function(a, b){
			return a.positions[0] - b.positions[0];
		});
		return nodes;
		function recurse(r){
			if(r){
				nodes.push(r);
				r.children.forEach(recurse);
			}
		}
	}

	function mark_nodes(){
		recurse(data);
		return data;
		function recurse(r){
			var i, child, parent, hasMark = false;
			if(r){
				r.type_set = d3.set();

				if(parent = r.parent){
					switch(r.edge_short_name){
						case 'acl':
						r.type_set.add('mod');
						break;
						case 'acl:relcl':
						r.type_set.add('mod');
						break;
						case 'acomp':
						r.type_set.add('obj');
						break;
						case 'advcl':
						r.type_set.add('mod');
						break;
						case 'advmod':
						r.type_set.add('mod');
						break;
						case 'amod':
						r.type_set.add('mod');
						break;
						case 'appos':
						r.type_set.add('mod');
						break;
						case 'aux':
						r.type_set.add('mod');
						r.type_set.add('aux');
						break;
						case 'auxpass':
						r.type_set.add('mod');
						r.type_set.add('aux');
						break;
						case 'cc':
						r.type_set.add('cc');
						break;
						case 'cc:preconj':
						r.type_set.add('cc');
						break;
						case 'ccomp':
						r.type_set.add('obj');
						break;
						case 'conj':
						r.type_set.add('conj');
						if(parent.type_set.has('evt')){
							r.type_set.add('evt');
						}
						break;
						case 'cop':
						r.type_set.add('cop');
						break;
						case 'csubj':
						r.type_set.add('subj');
						break;
						case 'csubjpass':
						r.type_set.add('obj');
						break;
						case 'det':
						r.type_set.add('mod');
						r.type_set.add('det');
						break;
						case 'det:predet':
						r.type_set.add('mod');
						break;
						case 'discourse':
						r.type_set.add('disc');
						break;
						case 'dobj':
						if(parent.type_set.has('pass'))
							r.type_set.add('mod')
						else
							r.type_set.add('obj');
						break;
						case 'expl':
						r.type_set.add('expl');
						break;
						case 'mark':
						r.type_set.add('mod');
						r.type_set.add('mark');
						parent.type_set.add('has:mark');
						parent.mark = r;
						break;
						case 'neg':
						r.type_set.add('mod');
						r.type_set.add('neg');
						break;
						case 'nmod':
						if(parent.type_set.has('pass'))	
							r.type_set.add('subj');
						else
							r.type_set.add('mod');
						break;
						case 'nmod:pass':
						r.type_set.add('mod');
						break;
						case 'nmod:tmod':
						r.type_set.add('mod');
						r.type_set.add('tmp');
						break;
						case 'nummod':
						r.type_set.add('mod');
						r.type_set.add('num');
						break;
						case 'nsubj':
						r.type_set.add('subj');
						break;
						case 'nsubjpass':
						r.type_set.add('obj');
						break;
						case 'parataxis':
						r.type_set.add('para');
						break;
						case 'xcomp': 
						r.type_set.add('obj');
						break;
					}
				}
				//check if the node is a event node
				for(i = 0; i < r.children.length; i++){
					child = r.children[i];
					switch(child.edge_short_name){
						case 'nsubj':
						r.type_set.add('evt');
						break;
						case 'nsubjpass':
						r.type_set.add('pass');
						r.type_set.add('evt');
					}
				}

				for(i = 0; i < r.children.length; i++){
					child = r.children[i];
					recurse(child);
				}

			}	
		}
	}


	/* Triplet functions
	*
	*/


	var tree = {
		'data' : function(_){
			return arguments.length > 0 ? (data = _, this) : data;
		},
		'collapse_compond' : collapse_compond,
		'find_roles' : find_roles
	}; 

	return tree;
}