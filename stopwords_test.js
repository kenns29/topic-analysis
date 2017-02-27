var Stopwords = require('./nlp/stopwords');
var co = require('co');
global.__base = __dirname;
Stopwords().load();
