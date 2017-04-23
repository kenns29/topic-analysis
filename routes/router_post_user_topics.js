var btoa = require('btoa');
module.exports = exports = post;
function post(passport){
  return function(req, res){
    var text = req.file.buffer.toString('utf8');
    console.log('text', text);
    res.send('success');
  };
}
