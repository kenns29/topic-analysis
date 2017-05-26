var $ = require('jquery');
var d3 = require('../load_d3');
var container = '#top-keywords-div';
var table;
var titlesTable;
//var data = [{year, [{word1, [tile1, title2]},{}},{year}];
//<div id='1997'><a>word1</a><a>word2</a></div>
var titlesContainer = '#topword-titles-viewer-div';
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

    titlesDiv = d3.select(titlesContainer).append('div')
    .attr('class', 'titles')
    .style('background-color', '#F8F8F8')
    .style('width', '100%');

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
      for (var j = 0; j < jsonArr[i].words.length; j++) {
        cellHtml += "<a>" + jsonArr[i].words[j].word + "</a>";
        cellHtml += "<br>";
      }
  		cell.html(cellHtml);
  	}
    //register event listener to node "a".
    function wordClick(d, i) {
        d3.select(this)
        .style('background-color', 'rgb(' + [225, 182, 193] + ')');

        titlesDiv.select('p')
        .style('text-align', 'center')
        .style('margin', '0 auto')
        .style('display', 'inline-block');

        titlesDiv.html("");
        console.log(d);
        var titlesList;
        var lightedWord;
        titlesList = d.titles;
        highlightWords = d.textsOfWord;
        
        var firstLine;
        firstLine = "<p>" + "<b>" + d.word + "</b>" + " has " + titlesList.length + " titles." + "</p>";
        titlesDiv.html(firstLine);

        for(var i = 0; i < titlesList.length; i++) {
          //eachLine = [{substring: , isLightWord: }, {}, {}] is an array of words in the title.
          var title = titlesList[i];
          var wordsOfTitle = title.split(" ");
          var eachLine = [];
          for (var index = 0; index < wordsOfTitle.length; index++) {
              var flag = 0;
              for (var j = 0; j < highlightWords.length; j++) {
                if (wordsOfTitle[index] == highlightWords[j]) {
                    flag = 1;
                }
              }
              if (flag == 0) {
                  eachLine.push({substring: wordsOfTitle[index], isLightWord: 0});
              }  else {
                eachLine.push({substring: wordsOfTitle[index], isLightWord: 1});
              }        
          }
          console.log(eachLine);
          //draw the titleList
          var ul = titlesDiv.append('ul');

          var li = ul.append('li');
          li.selectAll('span')
          .data(eachLine)
          .enter()
          .append('span')
            .style('background-color', function(d){
              console.log(d);
              if(d.isLightWord == 0) return 'white';
              else{
                return 'rgba(' + [0, 0, 255, 0.3] + ')';
              }
            })
            .text(function(d) {
              console.log(d);
              return d.substring + " ";
            });
        }    

      }

      // function deleteWord(d, i) {
      //   d3.event.preventDefault();
      //   d3.select(this)
      //   .style('visibility', 'hidden');
      // }

      d3.select(container).selectAll("th")
      .data(jsonArr)
        .selectAll("a")
        .data(function(d,i){return d.words;})
        .on("click", wordClick)
        .on("contextmenu", function() {
            console.log(this);
            d3.select(this).remove();
            d3.event.preventDefault();
          });



  }

  var ret = {};
  ret.init = init;
  ret.addData = addData;
  return ret;
}
