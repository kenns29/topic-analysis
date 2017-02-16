// Before calling node index.js
// Run the following: npm install express body-parser multer  --save
global.__base = __dirname;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var routes = require('./routes/index');
var morgan = require('morgan');
var fs = require('fs');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
var access_log_stream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});
app.use(morgan('combined', {stream : access_log_stream}));
app.use('/', routes);
app.listen(10082, function () {
  console.log('Example app listening on port 10082!');
});
module.exports = app;
