var router_load_papers = require('./router_load_papers');
var router_topic_trainer = require('./router_topic_trainer');
var router_load_panels = require('./router_load_panels');
var router_load_topic_model_stats = require('./router_load_topic_model_stats');
var router_load_topic_model = require('./router_load_topic_model');
var router_delete_topic_model = require('./router_delete_topic_model');
var router_load_tfidf = require('./router_load_tfidf');
var router_load_keyword_timeline_data = require('./router_load_keyword_timeline_data');
var express = require('express');
module.exports = exports = function(passport){
  var router = express.Router();
  router.get('/', function(req, res) {
    res.render('index', { title: 'Topic Analysis' });
  });
  router.get('/login', function(req, res){
    res.render('login', { title : 'Login', message: req.flash('loginMessage') });
  });
  router.get('/signup', function(req, res){
    res.render('signup', { message: req.flash('signupMessage') });
  });
  router.get('/userprofile', isLoggedIn, function(req, res){
    res.render('userprofile', {user : req.user});
  });
  router.get('/logout', function(req, res){
    req.logout(); req.redirect('/');
  });
  router.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/login', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/userprofile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
  router.get('/loadpapers', router_load_papers);
  router.get('/loadpanels', router_load_panels);
  router.get('/topictrainer', router_topic_trainer);
  router.get('/loadtopicmodelstats', router_load_topic_model_stats);
  router.get('/loadtopicmodel', router_load_topic_model);
  router.get('/deletetopicmodel', router_delete_topic_model);
  router.get('/loadtfidf', router_load_tfidf);
  router.get('/loadkeywordtimelinedata', router_load_keyword_timeline_data);
  return router;
};
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
