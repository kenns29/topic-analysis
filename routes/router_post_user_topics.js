var btoa = require('btoa');
module.exports = exports = post;
function post(passport){
  return function(req, res){
    var buffer = req.file.buffer;
    var encoding = req.file.encoding;
    var text = buffer.toString(encoding);
    console.log('text', text);
    res.send('success');
  };
}
