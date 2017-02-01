var GetPanels = require('../db_mongo/get_panels');
module.exports = exports = function(req, res){
  var get_panels = GetPanels();
  get_panels().then(function(data){
    res.json(data);
  });
};
