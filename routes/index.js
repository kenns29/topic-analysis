var router_index = require('./router_get_index');
var router_login = require('./router_get_login');
var router_signup = require('./router_get_signup');
var middleware_is_logged_in = require('./middleware_is_logged_in');
var router_user_profile = require('./router_get_userprofile');
var router_logout = require('./router_get_logout');

var router_post_signup = require('./router_post_signup');
var router_post_login = require('./router_post_login');
var router_post_user_topics = require('./router_post_user_topics');

var router_load_papers = require('./router_load_papers');
var router_topic_trainer = require('./router_topic_trainer');
var router_load_panels = require('./router_load_panels');
var router_load_topic_model_stats = require('./router_load_topic_model_stats');
var router_load_topic_model = require('./router_load_topic_model');
var router_load_topic_models = require('./router_load_topic_models');
var router_delete_topic_model = require('./router_delete_topic_model');
var router_load_tfidf = require('./router_load_tfidf');
var router_load_keyword_timeline_data = require('./router_load_keyword_timeline_data');
var router_load_word_tree = require('./router_load_word_tree');
var router_load_user_topic_timeline_data = require('./router_load_user_topic_timeline_data');
var router_load_user_topics = require('./router_load_user_topics');
var router_test = require('./router_test');
var express = require('express');
module.exports = exports = function(passport, upload){
  var router = express.Router();
  router.get('/', router_index(passport));
  router.get('/login', router_login(passport));
  router.get('/signup', router_signup(passport));
  router.get('/userprofile', middleware_is_logged_in(passport), router_user_profile(passport));
  router.get('/logout', router_logout(passport));

  router.post('/signup', router_post_signup(passport));
  router.post('/login', router_post_login(passport));
  router.post('/usertopics', upload.single('file'), router_post_user_topics(passport));

  router.get('/loadpapers', router_load_papers(passport));
  router.get('/loadpanels', router_load_panels(passport));
  router.get('/topictrainer', router_topic_trainer(passport));
  router.get('/loadtopicmodelstats', router_load_topic_model_stats(passport));
  router.get('/loadtopicmodel', router_load_topic_model(passport));
  router.get('/loadtopicmodels', router_load_topic_models(passport));
  router.get('/deletetopicmodel', router_delete_topic_model(passport));
  router.get('/loadtfidf', router_load_tfidf(passport));
  router.get('/loadkeywordtimelinedata', router_load_keyword_timeline_data(passport));
  router.get('/loadwordtree', router_load_word_tree(passport));
  router.get('/loadusertopictimelinedata', router_load_user_topic_timeline_data(passport));
  router.get('/loadusertopics', router_load_user_topics(passport));
  router.get('/test', router_test(passport));
  return router;
};
