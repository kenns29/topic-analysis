var $ = require('jquery');
var d3 = require('../load_d3');
//initialize tab change
module.exports = exports = $('ul.nav.nav-tabs li').each(function(){
	$(this).on('click', tab_util().click);
});

function tab_util(){
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
