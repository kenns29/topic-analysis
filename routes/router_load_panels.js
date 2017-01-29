var get_panels = require('../db_mongo/get_panels');
module.exports = function(req, res){
  get_panels().then(function(data){
    res.json(data);
  });
};
