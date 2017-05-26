var co = require('co');
var GetPapers = require('../db_mongo/get_papers');
var HashMap = require('hashmap');
var StopWords = require('../nlp/stopwords');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var get_data = GetPapers();
    co(function*(){
      console.log("here");
      var data = yield get_data.type(-1).to_year(2016).load();
      var paper;
      var year;
      var tokens;
      var Map1 = new HashMap();
      var textMap = new HashMap();
      for (var i = 0; i < data.length ; i++) {
      	paper = data[i];
      	year = paper.year;
            title = paper.title;
      	if (!Map1.has(year)) {
      		Map1.set(year, new HashMap());
      	}
      	tokens = paper.title_tokens;
      	var lemma;
      	var Map2 = Map1.get(year);
      	for (var j = 0; j < tokens.length; j++) {
      		lemma = tokens[j].lemma.toLowerCase();
                  text = tokens[j].text;
      		if (!Map2.has(lemma)) {
                        var titleSet = new Set();
                        titleSet.add(title);
      			Map2.set(lemma, titleSet);
      		} else {
                        Map2.get(lemma).add(title);
      		}

                  if (!textMap.has(lemma)) {
                        var textSet = new Set();
                        textSet.add(text);
                        textMap.set(lemma, textSet);
                  } else {
                        textMap.get(lemma).add(text);
                  }
      	}
      }
      console.log(textMap);
      // var arrayOfTexts = [];
      // textMap.forEach(function(value, key) {
      //       var textObj = {};
      //       textObj.lemma = key;
      //       textObj.texts = value;
      //       arrayOfTexts.push(textObj);
      // });
      // console.log(arrayOfTexts);

      var arrayOfYears = [];
      var stopwords = yield StopWords().load();
      Map1.forEach(function(value1, key1){
      	var arrayOfKeywords = [];
      	value1.forEach(function(value2, key2){
      		if (stopwords.has(key2)) {
      			return;
      		}
      		var wordCnt = {};
      		wordCnt.word = key2;
      		wordCnt.cnt = value2.size;
                  wordCnt.titles = value2;
      		arrayOfKeywords.push(wordCnt);
      	});

      	arrayOfKeywords.sort(function(a, b) {
      		return b.cnt - a.cnt;
      	});

      	var arrayOfTopN = [];

      	arrayOfKeywords.slice(0, 10).forEach(function(pair) {
                  var arrayOfTitles = [];
                  for (let title of pair.titles) arrayOfTitles.push(title);
                  var textsOfLemma = [];
                  textsOfLemma= Array.from(textMap.get(pair.word));
      		arrayOfTopN.push({word: pair.word, titles: arrayOfTitles, textsOfWord: textsOfLemma});
                  
      	});
            // console.log(arrayOfTopN);
      	var yearObj = {};
      	yearObj.year = key1;
      	yearObj.words = arrayOfTopN;
      	arrayOfYears.push(yearObj);
      });
      res.json(arrayOfYears);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
