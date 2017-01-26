var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var get_docs = require('./get_docs');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});
/* GET documents */
router.get('/getdocs', get_docs);
module.exports = router;
