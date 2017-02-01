var GetPapers = require('../db_mongo/get_papers');
module.exports = function(req, res){
  var get_papers = GetPapers();
  get_papers().then(function(data){
    res.json(data);
  });
};
