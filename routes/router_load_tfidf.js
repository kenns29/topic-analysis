var co = require('co');
var DOC = require('../flags/doc_flags');
var GetPanels = require('../db_mongo/get_panels');
var GetPapers = require('../db_mongo/get_papers');
var tf_idf = require('../nlp_tf_idf/tf_idf');
module.exports = exports = load;
function load(passport){
  return function(req, res){
    var type = Number(req.query.type);
    var level = Number(req.query.level);
    var field = Number(req.query.field);
    var get_data = level === DOC.PN ? GetPapers() : GetPanels();
    co(function*(){
      var data = yield get_data.type(type).year(-1).load();
      var json = tf_idf().field(field).calc(data);
      res.json(json);
    }).catch(function(err){
      console.log(err);
      res.status(500);
      res.send(err);
    });
  };
}
