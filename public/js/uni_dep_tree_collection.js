function uni_dep_tree_collection(_){
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

	// function merge_sem_roles(word){
	// 	var roles = flatten_sem_roles();
	// 	var i, j;
	// 	for(i = 0; i < roles.length; i++){
			
	// 	}
	// }
	var collection = {
		'data' : function(_){
			return arguments.length > 0 ? (data = _, this) : data;
		},
		'collection' : function(_){
			return uni_dep_collection
		},
		'flatten' : flatten,
		'flatten_sem_roles' : flatten_sem_roles
	};
	return collection;
}