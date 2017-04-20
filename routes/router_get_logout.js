module.exports = exports = load;
function load(passport){
  return function(req, res){
    req.logout(); res.redirect('/');
  };
}
