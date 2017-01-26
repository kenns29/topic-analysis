var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = function joined_sem_tree_view(_){
	var data = _;
	var container = '#joined_sem_tree_view';
	var svg, width, height;
	var g, W, H;
	var margin = {left : 10, top: 100, bottom:10, right:10};
	var root;
	var layout;
	var nodes, links;
	var font_scale;
	function init(){
		width = $(container).width();
		height = $(container).height();
		layout = d3.tree().size([height, width - 400]);
		svg = d3.select(container).append('svg')
		.attr('width', width)
		.attr('height', height);
		g = svg.append('g')
		.attr('class', 'joined-sem-tree-g');
		font_scale = d3.scaleThreshold()
		.domain([ 1, 2, 3, 4, 5, 10 ])
		.range([ 10, 20, 30,40, 45, 50, 55 ]);
		return view;
	}

	function update(source){
		var i = 0;
		root = d3.hierarchy(data, function(d){return d.children;});
		layout(root);

		var nodes = root.descendants();
		// links = nodes.links(data);

		var node_sel = g.selectAll('.joined-sem-tree-g-node')
		.data(nodes, function(d){return d.id || (d.id = ++i);});

		var node_enter = node_sel.enter().append('g')
		.attr('class', 'joined-sem-tree-g-node');

		node_enter
		var text_enter = node_enter.append('text')
		.attr('x', 0)
		.attr('y', 0)
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('font-size', function(d){
			return font_scale(d.data.size);
		});

		text_enter.selectAll('tspan')
		.data(function(d){
			var token_array = d.data.token.split(' ');
			return 	token_array;})
		.enter()
		.append('tspan')
		.html(function(d, i){
			if(i == 0){
				return d;
			}
			else{
				return '&nbsp;' + d;
			}
		});

		text_enter.each(function(d, i){
			d.length = this.getComputedTextLength();
		});

		x_collide(data);

		var node_update = g.selectAll('.joined-sem-tree-g-node');

		node_update
		.transition().duration(500)
		.attr('transform', function(d){
			return 'translate(' + [d.y, d.x] + ')';
		});


		var node_exit = node_sel.exit().remove();

		var link_sel = g.selectAll('.joined-sem-tree-g-link')
		.data(root.descendants().slice(1));

		var link_enter = link_sel.enter()
		.append('path')
		.attr('class', 'joined-sem-tree-g-link')
		.attr('d', function(d){
			return edge_path(d.parent, d);
		})
		.attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none');


		var obj_pmod_sel = node_update.filter(function(d){
			return d.data.role === 'obj';
		})
		.selectAll('.joined-sem-tree-g-evt-modifiers')
		.data(function(d){
			return d.data.pmod;
		});

		var obj_pmod_enter = obj_pmod_sel
		.enter()
		.append('g')
		.attr('class', 'joined-sem-tree-g-evt-modifiers')
		.attr('transform', function(d, i){
			return 'translate(' + [-(i+1) * 10 - 20 * i, 0] + ')';
		});

		obj_pmod_enter.append('circle')
		.attr('r', 5)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'green');

		obj_pmod_enter.append('path')
		.attr('d', function(d, i){
			return 'M' + [0, 0]
			+ ' L' + [0, -(i +1) * 10]
			+ ' L' + [5, -(i+1) * 10]
		})
		.attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'none');

		obj_pmod_enter.append('text')
		.attr('x', 5)
		.attr('y', function(d, i){return -(i+1)*10;})
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('font-size', 10)
		.text(function(d){
			return d.token;
		});

		var evt_dmod_g = node_update.filter(function(d){
			return d.data.role === 'evt'
			&& d.data.children.length === 0
			&& d.data.dmod.length > 0;
		})
		.append('g')
		.attr('class', 'joined-sem-tree-g-evt-dmod-g')

		var evt_dmod_sel = evt_dmod_g
		.selectAll('.joined-sem-tree-g-evt-dmod')
		.data(function(d){
			return d.data.dmod;
		});

		var evt_dmod_enter = evt_dmod_sel.enter()
		.append('g').attr('class', 'joined-sem-tree-g-evt-dmod')
		.attr('transform', function(d, i){
			var parentData = d3.select(this.parentNode).data()[0];
			return 'translate(' + [(i+1)*10 + i*20 + parentData.length + 20, 0] + ')';
		});

		evt_dmod_enter.append('circle')
		.attr('r', 5)
		.attr('fill', 'green')
		.attr('stroke', 'black').attr('stroke-width', 1)

		evt_dmod_enter.append('path')
		.attr('d', function(d, i){
			var parentData = d3.select(this.parentNode.parentNode).data()[0];
			var length = parentData.data.dmod.length;
			return 'M' + [0, 0]
			+ ' L' + [0, -(length - i) * 10]
			+ ' L' + [5, -(length - i) * 10];
		})
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'none');

		evt_dmod_enter.append('text')
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('x', 5)
		.attr('y', function(d, i){
			var parentData = d3.select(this.parentNode.parentNode).data()[0];
			var length = parentData.data.dmod.length;
			return -(length - i) * 10;
		})
		.text(function(d){
			return d.token;
		});

		var obj_dmod_g = node_update.filter(function(d){
			return d.data.role === 'obj' && d.data.dmod.length > 0;
		})
		.append('g')
		.attr('class', 'joined-sem-tree-g-obj_dmod_g')

		var obj_dmod_sel = obj_dmod_g.selectAll('.joined-sem-tree-g-obj_dmod')
		.data(function(d){
			console.log('d.data.dmod', d.data.dmod);
			return d.data.dmod;
		});

		var obj_dmod_enter = obj_dmod_sel.enter().append('g')
		.attr('class', '.joined-sem-tree-g-obj_dmod')
		.attr('transform', function(d, i){
			var parentData = d3.select(this.parentNode).data()[0];
			return 'translate(' + [(i+1)*10 + i*20 + parentData.length + 20, 0] + ')';
		});

		obj_dmod_enter.append('circle')
		.attr('r', 5)
		.attr('stroke', 'black').attr('stroke-width', 1)
		.attr('fill', 'orange');

		obj_dmod_enter.append('path')
		.attr('d', function(d, i){
			var parentData = d3.select(this.parentNode.parentNode).data()[0];
			var length = parentData.data.dmod.length;
			return 'M' + [0, 0]
			+ ' L' + [0, (length - i) * 10]
			+ ' L' + [5, (length - i) * 10];
		})
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'none');

		obj_dmod_enter.append('text')
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('x', 5)
		.attr('y', function(d, i){
			var parentData = d3.select(this.parentNode.parentNode).data()[0];
			var length = parentData.data.dmod.length;
			return (length - i) * 10;
		})
		.text(function(d){
			return d.token;
		});
		return view;
	}


	function edge_path(n1, n2){
		var h_dist = Math.abs(n2.y - n1.y);
		var v_dist = Math.abs(n2.x - n1.x);
		var y0 = n1.y + n1.length + 5, x0 = n1.x,
			y1 = n2.y, x1 = n2.x;
		return 'M' + [y0,  x0]
			+ 'L' + [y0 + h_dist/3, x0]
			+ 'L' + [y0 + h_dist/3, x1]
			+ 'L' + [y1, x1];
	}

	function x_collide(r){
		recurse(r);
		function recurse(r){
			if(r && r.children){
				r.children.forEach(function(child){
					if(r.length + r.y >= g.y - 10){
						g.y = r.length + r.y + 30;
					}
					recurse(child);
				});
			}
		}
	}

	var view = {
		'data' : function(_){
			return arguments.length > 0 ? (data = _, this) : data;
		},
		'container' : function(_){
			return arguments.length > 0 ? (container = _, this) : container;
		},
		'init' : init,
		'update' : update
	};
	return view;
};
