var DOC = require('../../../flags/doc_flags');
var $ = require('jquery');
var d3 = require('d3');
var WordtreeControls = require('./wordtree_controls');
var LoadWordTree = require('../load/load_word_tree');
var co = require('co');
var DIRECTION = require('../../../flags/word_tree_direction_flags');
module.exports = exports = $('#keyword-tree-control-div #btn-draw-wordtree').click(function(){
  var flags = WordtreeControls.get_flags();
  var level = flags.level, type = flags.type, field = flags.field,
  year = flags.year, to_year = flags.to_year, use_stopwords = flags.use_stopwords;
  var text = $('#keyword-tree-control-div #textbox-keyword').val();
  co(function*(){
    var loading = global.word_tree.loading();
    var load_forward = LoadWordTree().type(type).field(field).level(level).use_stopwords(use_stopwords)
    .root_word(text).year(year).to_year(to_year).direction(DIRECTION.FORWARD);
    var load_reverse = LoadWordTree().type(type).field(field).level(level).use_stopwords(use_stopwords)
    .root_word(text).year(year).to_year(to_year).direction(DIRECTION.REVERSE);
    $(loading).show();
    var data_both = yield Promise.all([load_forward(), load_reverse()]);
    $(loading).hide();
    var data_forward = data_both[0], data_reverse = data_both[1];
    global.word_tree.data(data_forward);
    global.word_tree.data(data_reverse, true);
    global.word_tree.update();
  }).catch(function(err){
    console.log(err);
  });
});
