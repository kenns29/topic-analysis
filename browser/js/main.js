var $ = require('jquery');
var d3 = require('./load_d3');
var service_url = require('./service');
var UI_year_select = require('./UI/year_select');
$(document).ready(function(){
	UI_year_select.init();
});

$('#test').click(function(){
	$.ajax({
		url : service_url + '/traintopicmodel',
		data : {},
		dataType: 'json',
		success : function(data){
			console.log('data', data);
		}
	});
});
