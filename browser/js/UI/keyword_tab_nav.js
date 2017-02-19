var $ = require('jquery');
var TabUtil = require('./tab_util');
var tab_util = TabUtil().name('keyword-tab');
//initialize tab change
module.exports = exports = $('ul.nav.nav-tabs li').each(function(){
	$(this).on('click', tab_util.click);
});
