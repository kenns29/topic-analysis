var LocalStrategy   = require('passport-local').Strategy;
var co = require('co');
var User = require('./user');
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id());
    });
    passport.deserializeUser(function(id, done) {
        co(function*(){
          var user = yield User().find_by_id(id);
          done(null, user);
        }).catch(function(err){
          console.log(err);
          done(err);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
          co(function*(){
            var user  = yield User().find_by_email(email);
            if(user) return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            else{
              user = User().password(password).email(email);
              let mongo_user = yield user.update();
              return done(null, user);
            }
          }).catch(function(err){
            console.log(err);
            done(err);
          });
        });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        co(function*(){
          var user = yield User().find_by_email(email);
          if(!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
          if(!user.valid_password(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
          return done(null, user);
        }).catch(function(err){
          console.log(err);
          done(err);
        });
    }));
};
