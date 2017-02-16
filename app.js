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
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var fs = require('fs');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
var access_log_stream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});
app.use(morgan('combined', {stream : access_log_stream}));

// required for passport
app.use(session({
  secret: 'secretsecretsession',
  resave : false,
  saveUninitialized : false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', routes);
app.listen(10082, function () {
  console.log('Example app listening on port 10082!');
});
module.exports = app;
