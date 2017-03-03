var $ = require('jquery');
var TabUtil = require('./tab_util');
var tab_util = TabUtil().name('keyword-tab')
.tab_show(function(){
	$(this).addClass('active');
	let href = $(this).find('a').attr('href');
	$(href).removeClass('invisible');
})
.tab_hide(function(){
	$(this).removeClass('active');
	let href = $(this).find('a').attr('href');
	$(href).addClass('invisible');
});

//initialize tab change
module.exports = exports = tab_util.init();
