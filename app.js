global.__base = __dirname;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage:storage}); // for parsing multipart/form-data
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ConnStat = require('./db_mongo/connection');
var fs = require('fs');
var app = express();
app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text({type: 'text/plain'}));
require('./auth/passport')(passport);
app.use(express.static(path.join(__dirname, 'public')));
var access_log_stream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});
app.use(morgan('combined', {stream : access_log_stream}));
app.use(session({
  secret: 'secretsecretsession',
  resave : false,
  saveUninitialized : false,
  store : new MongoStore({url : ConnStat().url()})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var routes = require('./routes/index')(passport, upload);
app.use('/', routes);
app.listen(10082, function () {
  console.log('Listening on port 10082!');
});
module.exports = app;
