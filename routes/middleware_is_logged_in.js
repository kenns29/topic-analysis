module.exports = exports = load;
function load(passport){
  return function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  };
}
