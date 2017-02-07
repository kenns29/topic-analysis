var GetPapers = require('../db_mongo/get_papers');
var TopicModel = require('../mallet/topic_model');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var co = require('co');
var ConnStat = require('../db_mongo/connection');
module.exports = exports = function(req, res){
  var name = req.query.name;
  var year = Number(req.query.year);
  var num_topics = Number(req.query.num_topics);
  var num_iterations = Number(req.query.num_iterations);
  var get_papers = GetPapers().year(year);
  var topic_model = TopicModel();
  get_papers().then(function(data){
    if(!data || data.length === 0) return Promise.reject('NO_DATA');
    topic_model.num_iterations(num_iterations).num_topics(num_topics);
    var dat = title_data(data);
    return topic_model.build(dat);
  }).then(function(){
    var bin = topic_model.serializeBinary();
    var buffer = Buffer.from(bin, 'binary');
    return co(function*(){
      var db = yield MongoClient.connect(ConnStat().url());
      var col = db.collection('models_test');
      var bulk = col.initializeOrderedBulkOp();
      var binary = new mongodb.Binary(buffer);
      bulk.find({name:name}).upsert().updateOne({
        name : name,
        year : year,
        model : binary
      });
      yield bulk.execute();
      db.close();
      var json = topic_model.get_topics_with_id(10);
      res.json(json);
    });
  }).catch(function(err){
    console.log(err);
    res.status(500);
    res.send(err);
  });
};
// function title_data(data){
//   return data.map(function(d){
//     var text = '';
//     var pre_end_pos = 0;
//     for(let i = 0; i < d.tokens.length; i++){
//       let token = d.tokens[i];
//       if(pre_end_pos < token.begin_position){text += ' ';}
//       let word = token.lemma;
//       if(token.lemma.length > token.text.length){word = token.text;}
//       else if(token.lemma.length < token.text.length){
//         let spaces = '';
//         for(let j = 0; j < token.text.length - token.lemma.length; j++){spaces += ' ';}
//         word += spaces;
//       }
//       text += word;
//       pre_end_pos = token.end_position;
//     }
//     return {
//       id : d.id,
//       text : text
//     }
//   });
// }

function title_data(){
  return data.map(function(d){
    var pos2token = [];
    var text = '';
    var pre_end_pos = 0;
    for(let i = 0; i < d.tokens.length; i++){
      let token = d.tokens[i];
      let lemma_start_pos = text.length;
      if(pre_end_pos < token.begin_position){text += ' '; ++lemma_start_pos;}
      text += token.lemma;
      pos2token[lemma_start_pos] = d.token;
      pre_end_pos = token.end_position;
    }
    return {
      id : d.id,
      text : text,
      pos2token : pos2token
    }
  });
}
