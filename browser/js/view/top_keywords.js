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

    return ret;
  }

  function addData(jsonArr) {
  	// console.log(jsonArr);
  	var row;
  	for (var i = 0; i < jsonArr.length; i++) {
  		if (i % 6 == 0) {
  			row = table.append('tr');
  		}
  		var cell = row.append('th');
  		var cellHtml = "<span>" + jsonArr[i].year + "</span>"; 
      // for (var j = 0; j < jsonArr[i].words.length; j++) {
      for (var j = 0; j < 10; j++) {
        cellHtml += "<a>" + "<span>" + jsonArr[i].words[j].word + "</span>" + "</a>";
      }
  		cell.html(cellHtml);
  	}
    //register event listener to node "a".
    function wordClick(d, i) {
        console.log(d);
        d3.select(this).selectAll('span')
        .style('background-color', 'rgb(' + [225, 182, 193] + ')');

        titlesDiv.select('p')
        .style('text-align', 'center')
        .style('margin', '0 auto')
        .style('display', 'inline-block');

        titlesDiv.html("");
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
          // console.log(eachLine);
          //draw the titleList
          var ul = titlesDiv.append('ul');

          var li = ul.append('li');
          li.selectAll('span')
          .data(eachLine)
          .enter()
          .append('span')
            .style('background-color', function(d){
              // console.log(d);
              if(d.isLightWord == 0) return 'white';
              else{
                return 'rgba(' + [0, 0, 255, 0.3] + ')';
              }
            })
            .text(function(d) {
              // console.log(d);
              return d.substring + " ";
            });
        }    
      }  //end of wordClick function

      function deleteWord(d,i) {
        console.log(d);
        var deletedWord = this.textContent;
        var yearOftheWord = this.parentNode.children[0].textContent;
        var parentNodeOfword = this.parentNode;
        console.log(deletedWord);
        console.log(yearOftheWord);
            // console.log(parentNodeOfword);
        console.log(this);
        d3.select(this).remove();
        d3.event.preventDefault();
            // console.log("after deleting " + parentNodeOfword);
        var indexOftheObject;
        if (yearOftheWord > 1990) {
          indexOftheObject = yearOftheWord - 1979 -1;
        } else {
          indexOftheObject = yearOftheWord - 1979;
        }
        console.log(indexOftheObject);
        var arrayOfTheWord = jsonArr[indexOftheObject].words;
        var indexOfTheWord;
        for(var i = 0; i < arrayOfTheWord.length; i++) {
          if (deletedWord == arrayOfTheWord[i].word) {
              indexOfTheWord = i;
          }
        }
        arrayOfTheWord.splice(indexOfTheWord, 1);
        parentNodeOfword.innerHTML = '';
        var cellHtml;
        cellHtml = "<span>" + yearOftheWord + "</span>";
        for (var j = 0; j < 10; j++) {
          cellHtml += "<a>" + "<span>" + arrayOfTheWord[j].word + "</span>" + "</a>";
        }
        parentNodeOfword.innerHTML += cellHtml;
        console.log(parentNodeOfword);
        d3.select(parentNodeOfword)
        .selectAll("a")
        .data(function(d,i) {console.log(d); return d.words})
        .style('display', 'block')
        .on("click", wordClick)
        .on("contextmenu", deleteWord)
      } //end of the deletWord function

      d3.select(container).selectAll("th")
      .data(jsonArr)
        .selectAll("a")
        .style('display', 'block')
        .data(function(d,i){ return d.words;})   
        .on("click", wordClick)
        .on("contextmenu", deleteWord);



  }
  var ret = {};
  ret.init = init;
  ret.addData = addData;
  return ret;
}
