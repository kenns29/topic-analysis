module.exports = exports = load;
function load(passport){
  return function(req, res){
    res.render('login', { title : 'Login', message: req.flash('loginMessage') });
  };
}
