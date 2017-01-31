var router_load_papers = require('./router_load_papers');
var router_topic_trainer = require('./router_topic_trainer');
var router_load_panels = require('./router_load_panels');
var router_load_topic_model_stats = require('./router_load_topic_model_stats');
var router_load_topic_model = require('./router_load_topic_model');
var express = require('express');
router = express.Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/loadpapers', router_load_papers);
router.get('/loadpanels', router_load_panels);
router.get('/topictrainer', router_topic_trainer);
router.get('/loadtopicmodelstats', router_load_topic_model_stats);
router.get('/loadtopicmodel', router_load_topic_model);
module.exports = router;
