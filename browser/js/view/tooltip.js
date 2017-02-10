var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = exports = function(_container){
	var tooltip;
	var container;
	if(_container !== undefined){
		container = _container;
	}
	var font_size = '20px';
	function html_fun(d){return d;}
	function init(){
		tooltip = d3.select(container)
		.append('div')
		.attr("z-index","99")
		.style('opacity', 0)
		.style('position', 'absolute')
		.style('text-align', 'center')
		.style('padding', '2px')
		.style('font', '12px sans-serif')
		.style('background', 'lightsteelblue')
		.style('border', '0px')
		.style('border-radius', '8px')
		.style('display', 'none');
		return ret;
	}

	function x_pos(x){return x - $(this).width()/2;}
	function y_pos(y){return y - 40;}

	function show(sel, data){
		var element = sel;
		if(sel.node && typeof sel.node === 'function')
			element = sel.node();
		var mouse = d3.mouse(element);
		var x = mouse[0], y = mouse[1];
		tooltip.selectAll('div').remove();
		tooltip
		.style('width', 'auto')
		.style('height', 'auto')
		.style("top", function(){
			return y_pos.call(this, y) + 'px';
		});
		tooltip.append('div')
		.style('width', 'auto')
		.style('height', 'auto')
		.style('overflow-y', 'auto')
		.style('overflow-x', 'hidden')
		.style('font-size', font_size)
		.html(function(){return html_fun.call(this, data);});
		tooltip.style('left', function(){return x_pos.call(this, x) + 'px';});
		tooltip.style('display', null).style("opacity", .9);
		tooltip.moveToFront();
		return ret;
	}

	function move(sel, data){
		var element = sel;
		if(sel.node && typeof sel.node === 'function')
			element = sel.node();
		var mouse = d3.mouse(element);
		var x = mouse[0], y = mouse[1];

		tooltip
		.style("left", function(){
			return x_pos.call(this, x) + 'px';
		})
		.style("top", function(){
			return y_pos.call(this, y) + 'px';
		});
		if(data !== undefined && data !== null){
			tooltip.select('div').html(function(){return html_fun.call(this, data);});
		}
		return ret;
	}

	function hide(){
		tooltip.selectAll('div').remove();
		tooltip
		.style('opacity', 0)
		.style('display', 'none');
		return ret;
	}

	function ret(){
		return init();
	}

	ret.container = function(_){
		return arguments.length > 0 ? (container = _, ret) : container;
	};

	ret.tooltip = function(){return tooltip;};
	ret.show = show;
	ret.move = move;
	ret.hide = hide;
	ret.html = function(_){
		if(arguments.length > 0 && _ !== undefined){
			if(typeof _ === 'function') html_fun = _;
			else html_fun = function(){return _;}
			return ret;
		}
		else return html_fun;
	};
	ret.init = init;
	ret.x_pos = function(_){
		if(arguments.length > 0) {
			if(typeof _ === 'function') x_pos = _;
			else x_pos = function(){return _;};
			return ret;
		} else return x_pos;
	};
	ret.y_pos = function(_){
		if(arguments.length > 0) {
			if(typeof _ === 'function') y_pos = _;
			else y_pos = function(){return _;};
			return ret;
		} else return y_pos;
	};
	ret.font_size = function(_){return arguments.length > 0? (font_size = _, ret) : font_size;};
	return ret;
};
