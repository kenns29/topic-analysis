var GetPanels = require('../db_mongo/get_panels');
module.exports = exports = function(req, res){
  var year = Number(req.query.year);
  var get_panels = GetPanels().year(year);
  get_panels().then(function(data){
    res.json(data);
  });
};
