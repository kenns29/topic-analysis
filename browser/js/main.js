var $ = require('jquery');
var d3 = require('./load_d3');
global.service_url = require('./service');
global.UI_year_select = require('./UI/year_select');
global.document_viewer = require('./view/document_viewer');
$(document).ready(function(){
	global.UI_year_select.init();
	global.document_viewer.init();
	require('./UI/btn_load_papers');
	require('./UI/btn_train_topics');
});
