var $ = require('jquery');
var d3 = require('../load_d3');
var container = '#top-keywords-div';
var table;
//var data = [{year, [{word1, [tile1, title2]},{}},{year}];
//<div id='1997'><a>word1</a><a>word2</a></div>
module.exports = exports = display;
function display(){
  function init(){
    table = d3.select(container).append('table')
    .attr('class', 'table')
    .style('width', '100%')
    .style('text-align', 'inherit')
    .style('overflow-wrap', 'break-word')
    .style('word-break', 'break-all')
    .style('word-wrap', 'break-word')
    .style('white-space', 'pre-wrap')
    .style('table-layout', 'fixed')
    .style('padding-right', '0px')
    .style('padding-left', '0px')
    .style('position', 'relative')
    .style('font-size', '10px')
    .attr('border', 1);


    // for (var i = 0; i < 6; i++) {
    // 	var row = table.append('tr');
    // 	for (var j = 0; j < 6; j++) {
    // 		row.append('th').html(i + ',' + j);
    // 	}
    // }
    // header.append('th').attr('class', 'name').attr('align', 'center').style('width', '20%').style('display', 'table-cell').html('name');
    // header.append('th').attr('class', 'num-topics').attr('align', 'center').style('width', '20%').style('display', 'table-cell').html('num-dics');
    // header.append('th').attr('class', 'radio-td').attr('align', 'center').style('width', '10%').style('display', 'table-cell').html('sel');
    // header.append('th').attr('class', 'trash').attr('align', 'center').style('width', '10%').style('display', 'table-cell').html('del');
    return ret;
  }

  function addData(jsonArr) {
  	console.log(jsonArr);
  	var row;
  	for (var i = 0; i < jsonArr.length; i++) {
  		if (i % 6 == 0) {
  			row = table.append('tr');
  		}
  		var cell = row.append('th');
  		var cellHtml = jsonArr[i].year + "<br>";
      // var cellHtml = jsonArr[i].word + "<br>";
      for (var j = 0; j < jsonArr[i].words.length; j++) {
        cellHtml += jsonArr[i].words[j].word;
        cellHtml += "<br>";
      }
  		// for (let item of jsonArr[i].titles) {
  		// 	cellHtml += item;
  		// 	cellHtml += "<br>";
  		// }
  		cell.html(cellHtml);
  	}
  }

  var ret = {};
  ret.init = init;
  ret.addData = addData;
  return ret;
}
