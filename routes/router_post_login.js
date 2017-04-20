module.exports = exports = post;
function post(passport){
  return passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  });
}
