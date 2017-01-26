var uni_dep_tree = require('./uni-dep-tree');
var d3 = require('./load_d3');
module.exports = function uni_dep_tree_collection(_){
	var data = _;
	var uni_dep_collection = [];

	init();

	function init(){
		var i, j;
        var r,sent_coll,udt, tree, role;
        //for each sentence in the whole document
        for(i = 0; i < data.length; i++){
        	sent_coll = [];
        	//for each tree in the whole sentence
        	for(j = 0; j < data[i].length; j++){
        		r = data[i][j];
        		udt = uni_dep_tree(r);
        		tree = udt.data();
        		role = udt.sem_roles();
        		sent_coll.push({
        			'udt' : udt,
        			'trees' : tree,
        			'roles' : role,
        			'sent_index' : i
        		});
        	}
        	uni_dep_collection.push(sent_coll);
        }
        return collection;
	}

	function flatten(){
		var i, j;
		var arr = [];
		for(i = 0; i < uni_dep_collection.length; i++){
			for(j = 0; j < uni_dep_collection[i].length; j++){
				arr.push(uni_dep_collection[i][j]);
			}
		}
		return arr;
	}

	function flatten_sem_roles(){
		var i, j;
		var flat_roles = [];
		for(i = 0; i < uni_dep_collection.length; i++){
			for(j = 0; j < uni_dep_collection[i].length; j++){
				flat_roles = flat_roles.concat(uni_dep_collection[i][j].roles);
			}
		}
		return flat_roles;
	}

	function join_sem_tree(word, pos){
		var regex = new RegExp(word, 'i');
		var roles = flatten_sem_roles();
		var role;
		var i, j;
		var subj_token, obj_token, evt_token;
		var r = {
			'token' : word,
			'name' : word,
			'nodes' : [],
			'children' : [],
			'child_map' : d3.map(),
			'dmod' : [],
			'pmod' : [],
			'size' : 1,
			'role' : 'subj'
		};

		var e;
		var o;
		for(i = 0; i < roles.length; i++){
			role = roles[i];
			if(role.subj && role.subj.coref_rep_mention.match(regex)){
				r.nodes.push(role.subj);
				r.dmod = r.dmod.concat(role.subj_mods);
				++r.size;
				if(role.evt){
					if(r.child_map.has(role.evt.lemma)){
						e = r.child_map.get(role.evt.lemma);
						e.nodes.push(role.evt);
						++e.size;
					}
					else{
						e = {
							'token' : role.evt.lemma,
							'name' : role.evt.lemma,
							'nodes' : [role.evt],
							'children' : [],
							'child_map' : d3.map(),
							'dmod' : [],
							'pmod' : [],
							'size' : 1,
							'role' : 'evt'
						};
						r.children.push(e);
						r.child_map.set(role.evt.lemma, e);
					}

					if(role.obj){
						if(e.child_map.has(role.obj.coref_rep_mention)){
							o = e.child_map.get(role.obj.coref_rep_mention);
							o.nodes.push(role.obj);
							++o.size;
						}
						else{
							o = {
								'token' : role.obj.coref_rep_mention,
								'name' : role.obj.coref_rep_mention,
								'nodes' : [role.obj],
								'children' : [],
								'child_map' : d3.map(),
								'dmod' : [],
								'pmod' : [],
								'size' : 1,
								'role' : 'obj'
							};

							e.children.push(o);
							e.child_map.set(role.obj.coref_rep_mention, o);
						}
						o.dmod = o.dmod.concat(role.obj_mods);
						o.pmod = o.pmod.concat(role.evt_mods);
					}

					e.dmod = e.dmod.concat(role.evt_mods);
					e.pmod = e.pmod.concat(role.subj_mods);

				}
			}
		}
		return r;
	}
	var collection = {
		'data' : function(_){
			return arguments.length > 0 ? (data = _, this) : data;
		},
		'collection' : function(_){
			return uni_dep_collection
		},
		'flatten' : flatten,
		'flatten_sem_roles' : flatten_sem_roles,
		'join_sem_tree' : join_sem_tree
	};
	return collection;
};
