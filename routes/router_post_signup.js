module.exports = exports = post;
function post(passport){
  return passport.authenticate('local-signup', {
    successRedirect : '/login',
    failureRedirect : '/signup',
    failureFlash : true
  });
}
