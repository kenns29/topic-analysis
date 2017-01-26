var get_papers = require('../db_mongo/get_papers');
module.exports = function(req, res){
  get_papers().then(function(data){
    res.json(data);
  });
};
