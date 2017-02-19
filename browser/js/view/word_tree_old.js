function word_tree(data, container, reverse) {
	var self = this;
	this.reverse = reverse;
	// var textScale = d3.scale.threshold().domain(
	// [ 1, 2, 3, 4, 5, 10, 20, 30, 40 ]).range(
	// [ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
	// return d;
	// }));

	var textScale = d3.scale.threshold().domain(
			[ 1, 2, 3, 4, 5, 10, 20, 30, 40 ]).range(
			[ 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
				return d;
			}));

	var tinyTextScale = d3.scale.threshold().domain(
			[ 1, 2, 3, 4, 5, 10, 20, 30, 40 ]).range(
					[ 0, 15, 20, 25, 30, 35, 40, 45, 50, 55 ].map(function(d) {
						return d * 0.5;
					}));
	var treeHeight = findTreeHeight(data);
	var width = 80 * treeHeight + 80;

	var margin = {
		top : 20,
		right : 120,
		bottom : 20,
		left : 120
	};

	var height = findHeightFromLeafNodes(findLeafNodes(data));
	if (height < $(container).height()) {
		height = $(container).height();
	}
	var height0 = height;


	var i = 0, duration = 750, root;

	var tree = d3.layout.partition().size([ height, width ])
	.sort(function(a, b) {
		return b.ovalue - a.ovalue;
	});

	var tip = d3.tip().attr('class', 'd3-tip').offset([ -10, 0 ]).html(
			function(d) {
				return "<span style='color:white'>" + d.name + "</span><span style='color:blue'>Frequency</span><span style='color:orange'>" + d.ovalue.toFixed(2) + "</span>";
			});

	var diagonal = d3.svg.diagonal().projection(function(d) {
		return [ d.y, d.x ];
	}).source(function(e) {
		if(!self.reverse){
			var y = e.source.y + (e.source.length ? e.source.length + 5 : 0)
		}
		else{
			y = (width - e.source.y) - (e.source.length ? e.source.length + 5 : 0);
		}
		return {
			x : e.source.x,
			y : y
		}
	}).target(function(e) {
		if(!self.reverse){
			var y = e.target.y - (e.target.length ? 5 : 0);
		}
		else{
			y = (width - e.target.y) + (e.target.length ? 5 : 0);
		}
		return {
			x : e.target.x,
			y : y
		}
	});

	var svg = d3.select(container).append("svg").attr("width",
			width + margin.right + margin.left).attr("height",
			height + margin.top + margin.bottom).append("g").attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	normalizeValue(data);

	root = data;
	root.x0 = height / 2;
	root.y0 = 0;

	this.updateWithData = function(data, reverse) {
		self.reverse = reverse;

		diagonal = d3.svg.diagonal().projection(function(d) {
			return [ d.y, d.x ];
		}).source(function(e) {
			if(!self.reverse){
				var y = e.source.y + (e.source.length ? e.source.length + 5 : 0)
			}
			else{
				y = (width - e.source.y) - (e.source.length ? e.source.length + 5 : 0);
			}
			return {
				x : e.source.x,
				y : y
			}
		}).target(function(e) {
			if(!self.reverse){
				var y = e.target.y - (e.target.length ? 5 : 0);
			}
			else{
				y = (width - e.target.y) + (e.target.length ? 5 : 0);
			}
			return {
				x : e.target.x,
				y : y
			}
		});

		treeHeight = findTreeHeight(data);
		width = 80 * treeHeight + 80;
		normalizeValue(data);
		root = data;
		root.x0 = height / 2;
		root.y0 = 0;

		if (svg) {
			svg.remove();
		}

		d3.select(container).select('svg').attr('width',
				width + margin.right + margin.left);

		tree.size([ height, width ]);
		svg = d3.select(container).select('svg').append("g").attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");
		update(root);
	}

	// root.children.forEach(collapse);
	update(root);

	function update(source) {
		var leafNodes = findLeafNodes(root);
		height = findHeightFromLeafNodes(leafNodes);
		if (height < $(container).height()) {
			height = $(container).height();
		}
		tree.size([ height, width ]);


		// Compute the new tree layout.
		var nodes =tree.nodes(root).reverse();
		rePosNodesVert(root);
		var maxDepth = d3.max(nodes, function(g){
			return g.depth;
		});
		var cDepth = maxDepth - 1;
		while(isSecondLvlTooLarge(source) && cDepth > source.depth + 1){
			simplifyNodesOnDepth(nodes, cDepth);
			leafNodes = findLeafNodes(root);
			height = findHeightFromLeafNodes(leafNodes);
			tree.size([height, width]);
			nodes = tree.nodes(root).reverse();
			rePosNodesVert(root);
			cDepth --;
		}
		if (height < $(container).height()) {
			height = $(container).height();
		}
		tree.size([height, width]);
		nodes = tree.nodes(root).reverse();
		rePosNodesVert(root);

		var links = tree.links(nodes);

		if (height0 < height) {
			d3.select(container).select('svg').attr("height",
					height + margin.top + margin.bottom);
			height0 = height;
		} else {
			d3.select(container).select('svg').transition().delay(duration)
					.attr("height", height + margin.top + margin.bottom);
			height0 = height;
		}

		// Update the nodes…
		var node = svg.selectAll("g.node").data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g").attr("class", "node").attr(
				"transform", function(d) {
					if(self.reverse){
						return 'translate(' + (width-source.y0) + ',' + source.x0 + ')';
					}
					else{
						return "translate(" + source.y0 + "," + source.x0 + ")";
					}
				}).on("click", click).on('mouseover', function(d, i) {
			tip.show(d, i);
			var parent = d;
			while (parent) {
				// highlight node
				node.filter(function(g) {
					return g.id == parent.id;
				}).attr('fill', 'orange');
				// highlight link
				link.filter(function(g) {
					return g.target.id == parent.id;
				}).style('stroke', 'orange');

				parent = parent.parent;
			}
		}).on(
				'mouseout',
				function(d, i) {
					tip.hide(d, i);
					var parent = d;
					while (parent) {
						node.filter(function(g) {
							return g.id == parent.id;
						}).attr('fill', 'black');

						// highlight link
						link.filter(function(g) {
							return g.target.id == parent.id;
						}).style('fill', 'none').style('stroke', '#ccc').style(
								'stroke-width', '1.5px')

						parent = parent.parent;
					}
				});

		// enter the text: here set the attributes value is not necessary
		var textEnter = nodeEnter.append("text").attr("x", function(d) {
			return 0;
		}).attr("dy", ".35em").attr("text-anchor", function(d) {
			return self.reverse ? 'end' : 'start';
		}).style('font-size', fontSize).style("fill-opacity", 1e-6);

		textEnter.selectAll('tspan').data(function(d) {
			return d.words;
		}).enter().append('tspan').html(function(d, i) {
			if (i == 0) {
				return d;
			} else {
				return '&nbsp;' + d;
			}
		});

		// update the text
		var textUpdate = node.select("text").attr("x", function(d) {
			return 0;
		}).attr("dy", ".35em").attr("text-anchor", function(d) {
			return self.reverse ? 'end' : 'start';
		})
		.style('font-size', fontSize);

		// critical: update the length property of the node data to be the text
		// length
		textUpdate.each(function(d, i) {
			d.length = this.getComputedTextLength();
		});

		// re position the nodes so that if the nodes overlap each or are too
		// close, they are separated
		rePosNodesRecurse(nodes[nodes.length - 1]);

		var topLeaf = findTopLeafNode(nodes[nodes.length - 1]);
		console.log('topLeaf', topLeaf);
		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr("transform",
				function(d) {
					if(self.reverse){
						return 'translate(' + (width - d.y) + ',' + d.x + ')';
					}
					else{
						return "translate(" + d.y + "," + d.x + ")";
					}
				});

		textUpdate.style('fill-opacity', 1);
		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition().duration(duration).attr(
				"transform", function(d) {
					return "translate(" + source.y + "," + source.x + ")";
				}).remove();

		nodeExit.select("text").style("fill-opacity", 1e-6);

		// Update the links…
		var link = svg.selectAll("path.link").data(links, function(d) {
			return d.target.id;
		});

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g").attr("class", "link").attr("d",
				function(d) {
					var o = {
						x : source.x0,
						y : source.y0
					};
					return diagonal({
						source : o,
						target : o
					});
				});

		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration).attr("d", function(d) {
			var o = {
				x : source.x,
				y : source.y
			};
			return diagonal({
				source : o,
				target : o
			});
		}).remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	function rePosNodesVert(r){
		return rePosNodesVertRecurse(r), r;
	}

	function rePosNodesVertRecurse(r){
		if(r && r.children && r.children.length > 0){
			r.children.forEach(function(g){
				rePosNodesVertRecurse(g);
			});
			var xExtent = d3.extent(r.children, function(g){
				return g.x;
			});
			r.x = (xExtent[0] + xExtent[1]) / 2;
		}
	}

	function rePosNodesRecurse(r) {
		if (r.children) {
			r.children.forEach(function(g) {
				// if(r.length){
				if (r.length + r.y >= g.y - 10) {
					g.y = r.length + r.y + 30;
				}
				// }
				rePosNodesRecurse(g);
			});
		}
	}
	// Toggle children on click.
	function click(d) {
		if (d3.event.ctrlKey && d3.event.altKey) {
			var labels = [];
			var parent = d;
			while (parent) {
				labels.push(wordArr2Label(parent.words).trim());
				parent = parent.parent;
			}
			if(self.reverse){
				dairy_keyword_keyword_sequence = labels;
			}
			else{
				dairy_keyword_keyword_sequence = labels.reverse();
			}

			var str = dairy_keyword_keyword_sequence.reduce(function(pre, cur,
					ind) {
				if (pre == '') {
					return cur;
				} else {
					return pre + ' ' + cur;
				}
			}, '');

			d3.select('#dairy-keyword-word-tree-label-word-sequence').html(str);
		} else {
			// if the node was collapsed before
			if (d._hidden_children) {
				console.log('expand');
				resetChildrenSize(d);
				expandSibling(d);
				resetSimpleNodes(root);
				// if the node was not collapsed before
			} else if (d.parent && d.parent._hidden_children == null) {
				console.log('collapse');
				// resize the nodes along the path to the root to be the size of
				// the root node
				var p = d;
				while (p) {
					if (!p._value) {
						p._value = p.value;
						p._nvalue = p.nvalue;
						p.nvalue = root.nvalue;
						p.value = root.value;
					}
					p = p.parent;
				}
				collapseSibling(d);
				resetSimpleNodes(root);
			}

			update(d);
		}
	}

	/*
	 * Collapse a node
	 */
	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	/*
	 * find the top corner leaf node
	 */
	function findTopLeafNode(r) {
		var c = r;
		while (c.children) {
			var child = (function() {
				var largestValue = Number.NEGATIVE_INFINITY;
				var largestIndex = 0;
				c.children.forEach(function(g, k) {
					if (g.value > largestValue) {
						largestValue = g.value;
						largestIndex = k;
					}
				});
				return c.children[largestIndex];
			})();
			c = child;
		}
		return c;
	}

	/*
	 * Determine if a second lvl sub tree occupies too much space
	 */
	function isSecondLvlTooLarge(r){
		if(r.children){
			var e = d3.extent(r.children, function(g){
				return g.x;
			});
			return Math.abs(e[1] - e[0]) > 600;
		}
		else{
			return false;
		}
	}
	/*
	 * Simplify node when sub tree occupies too much space
	 */
	function simplifyNode(d){
		if(d.children && !d._children){
			d._children = d.children;
			var maxChild = d.children.reduce(function(pre, cur, ind){
				if(pre.value < cur.value){
					return cur;
				}
				else{
					return pre;
				}
			});
			maxChild.useTinyTextScale = true;
			d.children = [maxChild];
			d.useTinyTextScale = true;
//			d.parent.children.forEach(function(g){
//				g.useTinyTextScale = true;
//			});
		}
		else{
//			d.parent.children.forEach(function(g){
//				g.useTinyTextScale = true;
//			});
			d.useTinyTextScale = true;
		}
	}

	/*
	 * Simplify all nodes on the depth
	 */
	function simplifyNodesOnDepth(nodes, depth){
		for(var i = 0; i < nodes.length; i++){
			if(nodes[i].depth == depth){
				simplifyNode(nodes[i]);
			}
		}
	}
	/*
	 * Reset all the simplified nodes back to its original
	 */
	function resetSimpleNodes(r){
		if(r!= null){
			if(r.useTinyTextScale){
				r.useTinyTextScale = false;
			}
			if(r._children){
				r.children = r._children;
				r._children = null;
			}
			if(r.children){
				r.children.forEach(function(g){
					resetSimpleNodes(g);
				});
			}
		}
	}

	/*
	 * Estimate the height of the sub tree based on the leaf nodes
	 */
	function findHeightFromLeafNodes(leafNodes){
		return leafNodes.reduce(function(pre, cur, ind){
			if(cur.useTinyTextScale){
				return pre + tinyTextScale(cur.value) + 1;
			}
			else{
				return pre + textScale(cur.value) + 1;
			}
		}, 0);
	}
	/*
	 * font size of the text
	 */
	function fontSize(d) {
		if(d.useTinyTextScale){
			return tinyTextScale(d.nvalue) + 'px';
		}
		else{
			return textScale(d.nvalue) + 'px';
		}
	}

	/*
	 * Recursive Function to resize children texts to its original size
	 */
	function resetChildrenSize(r) {
		if (r.children) {
			r.children.forEach(function(g) {
				if (g._value) {
					g.nvalue = g._nvalue;
					g.value = g._value
					g._value = null;
					g._nvalue = null;
				}
				resetChildrenSize(g);
			});
		}
	}
	/*
	 * Obtain the label from the word array
	 */
	function wordArr2Label(arr) {
		return arr.reduce(function(pre, cur, ind) {
			if (pre === '') {
				return cur;
			} else {
				return pre + ' ' + cur;
			}
		}, '');
	}
	/*
	 * expand and collapse siblings
	 */
	function collapseSibling(d) {
		collapseSiblingRecurse(d);
	}

	function collapseSiblingRecurse(r) {
		if (r.parent && r.parent._hidden_children == null) {
			r.parent._hidden_children = [];
			r.parent.children.forEach(function(g, i) {
				if (r.id !== g.id) {
					r.parent._hidden_children.push(g);
				}
			});
			r.parent.children = [ r ];
			collapseSiblingRecurse(r.parent);
		}
	}
	function expandSibling(d) {
		expandSiblingRecurse(d);
	}
	function expandSiblingRecurse(r) {
		if (r != null) {
			if (r.children) {
				r.children.forEach(function(g) {
					expandSiblingRecurse(g);
				});
			}
			if (r._hidden_children) {
				r._hidden_children.forEach(function(g, i) {
					r.children.push(g);
				});
				r._hidden_children = null;
			}
		}
	}
	/*
	 * Just for finding the path: not used since have parent...
	 */
	function findPathToNode(d) {
		path = [];
		var isFoundObj = {};
		isFoundObj.isFound = false;
		findPathToNodeRecurse(root, d, path, isFoundObj);
		return path;
	}
	function findPathToNodeRecurse(r, d, path, isFoundObj) {
		if (r !== null) {
			if (r.id === d.id) {
				isFoundObj.isFound = true;
				path.push(r.id);
			} else {
				path.push(r.id);
				if (r.children) {
					r.children.forEach(function(g, i) {
						if (!isFoundObj.isFound) {
							findPathToNodeRecurse(g, d, path, isFoundObj);
						}
					});
				}
				if (!isFoundObj.isFound) {
					path.pop();
				}
			}
		}
	}

	/*
	 * find tree height
	 */
	function findTreeHeight(r) {
		return findTreeHeightRecurse(r);
	}
	function findTreeHeightRecurse(r) {
		if (r.children) {
			var maxLength = 1;
			r.children.forEach(function(d) {
				var length = findTreeHeightRecurse(d);
				if (length > maxLength) {
					maxLength = length;
				}
			});
			return maxLength + 1;
		} else {
			return 1;
		}
	}

	/*
	 * Normalize the values of text to [0, 50]
	 */
	function normalizeValue(r) {
		var obj = {};
		findMinMaxValue(r, obj);
		var dmin = ((obj.min - 5) < 0) ? 0 : obj.min - 5;
		var scale = d3.scale.linear().domain([ dmin, obj.max ])
				.range([ 0, 50 ]);
		normalizeValueRecurse(r, obj.min, obj.max, scale);

	}
	function normalizeValueRecurse(r, min, max, scale) {
		if (r != null) {
			r.ovalue = r.value;
			r.value = scale(r.value);
			r.nvalue = r.value;
			r.children.forEach(function(d) {
				return normalizeValueRecurse(d, min, max, scale)
			})
		}
	}

	function findMinMaxValue(data, obj) {
		obj.min = Number.POSITIVE_INFINITY;
		obj.max = Number.NEGATIVE_INFINITY;
		findMinMaxValueRecurse(data, obj);
	}
	function findMinMaxValueRecurse(r, obj) {
		if (r != null) {
			if (r.value > obj.max) {
				obj.max = r.value;
			}
			if (r.value < obj.min) {
				obj.min = r.value;
			}
			r.children.forEach(function(d) {
				findMinMaxValueRecurse(d, obj);
			});
		}
	}
	/*
	 * find all leaf nodes
	 */
	function findLeafNodes(r) {
		var list = [];
		findLeafNodesRecurse(r, list);
		return list;
	}
	function findLeafNodesRecurse(r, list) {
		if (r) {
			if (r.children && r.children.length > 0) {
				r.children.forEach(function(child) {
					findLeafNodesRecurse(child, list);
				});
			} else {
				list.push(r);
			}
		}
	}
}
