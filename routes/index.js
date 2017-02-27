var router_load_papers = require('./router_load_papers');
var router_topic_trainer = require('./router_topic_trainer');
var router_load_panels = require('./router_load_panels');
var router_load_topic_model_stats = require('./router_load_topic_model_stats');
var router_load_topic_model = require('./router_load_topic_model');
var router_delete_topic_model = require('./router_delete_topic_model');
var router_load_tfidf = require('./router_load_tfidf');
var router_load_keyword_timeline_data = require('./router_load_keyword_timeline_data');
var router_load_word_tree = require('./router_load_word_tree');
var express = require('express');
module.exports = exports = function(passport){
  var router = express.Router();
  router.get('/', function(req, res) {
    var loggedIn = req.user ? true : false;
    res.render('index', { title: 'Topic Analysis', loggedIn: loggedIn});
  });
  router.get('/login', function(req, res){
    res.render('login', { title : 'Login', message: req.flash('loginMessage') });
  });
  router.get('/signup', function(req, res){
    res.render('signup', { message: req.flash('signupMessage') });
  });
  router.get('/userprofile', function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }, function(req, res){
    res.render('userprofile', {user : req.user});
  });
  router.get('/logout', function(req, res){
    req.logout(); res.redirect('/login');
  });
  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/login',
    failureRedirect : '/signup',
    failureFlash : true
  }));
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/userprofile',
    failureRedirect : '/login',
    failureFlash : true
  }));
  router.get('/loadpapers', router_load_papers);
  router.get('/loadpanels', router_load_panels);
  router.get('/topictrainer', router_topic_trainer);
  router.get('/loadtopicmodelstats', router_load_topic_model_stats);
  router.get('/loadtopicmodel', router_load_topic_model);
  router.get('/deletetopicmodel', router_delete_topic_model);
  router.get('/loadtfidf', router_load_tfidf);
  router.get('/loadkeywordtimelinedata', router_load_keyword_timeline_data);
  router.get('/loadwordtree', router_load_word_tree);
  return router;
};
