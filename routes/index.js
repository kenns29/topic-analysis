var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/api', function(req, res) {
	res.json('hello.');
});

module.exports = router;