module.exports = exports = post;
function post(passport){
  return function(req, res){
    console.log('req.body', req.body);
    // console.log('req.file', req.file);
    res.send('success');
  };
}
