var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var get_docs = require('./get_docs');
var train_topic_model = require('./train_topic_model');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});
/* GET documents */
router.get('/getdocs', get_docs);
router.get('/traintopicmodel', train_topic_model);
module.exports = router;
