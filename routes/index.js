var router_load_papers = require('./router_load_papers');
var router_topic_trainer = require('./router_topic_trainer');
var router_load_panels = require('./router_load_panels');
var express = require('express');
router = express.Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/loadpapers', router_load_papers);
router.get('/loadpanels', router_load_panels);
router.get('/topictrainer', router_topic_trainer);
module.exports = router;
