module.exports = exports = load;
function load(passport){
  return function(req, res){
    res.render('signup', { message: req.flash('signupMessage') });
  };
}
