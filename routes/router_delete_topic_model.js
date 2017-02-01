var fsp = require('fs-promise');
module.exports = exports = function(req, res){
  var name = req.query.name;
  var dir = './models/';
  fsp.unlink(dir + name).then(function(){
    res.send('success');
  }).catch(function(err){
    console.log(err);
  });
};
