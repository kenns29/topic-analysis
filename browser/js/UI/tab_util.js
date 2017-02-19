var d3 = require('../load_d3');
var $ = require('jquery');
module.exports = exports = function(){
  var name = "doc-tab"
	function click(){
		var self = this;
		if(d3.select(this).attr('name') === name){
			d3.select(this)
			.classed('active', true);
			var href = d3.select(this)
			.select('a')
			.attr('href');
			$(href).addClass('in active');
			$('ul.nav.nav-tabs li').not(self).each(function(){
				if(d3.select(this).attr('name') === name){
					d3.select(this)
					.classed('active', false);
					var href = d3.select(this).select('a')
					.attr('href');
					if(href !== '#')
						$(href).removeClass('in active');
				}
			});
		}
	}
	var ret = {};
	ret.click = click;
  ret.name = function(_){return arguments.length > 0 ?(name =_,ret) : name;};
	return ret;
}
