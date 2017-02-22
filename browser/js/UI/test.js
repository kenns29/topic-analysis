var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadWordTree = require('../load/load_word_tree');
var co = require('co');
var DIRECTION = require('../../../flags/word_tree_direction_flags');
module.exports = exports = $('#test').click(function(){
  co(function*(){
    var loading = global.word_tree.loading();
    $(loading).show();
    var data = yield LoadWordTree().root_word('lesbian').year(-1)
    .direction(DIRECTION.FORWARD).load();

    // console.log('data', JSON.stringify(data));
    global.word_tree.data(data);
    data = yield LoadWordTree().root_word('lesbian').year(-1)
    .direction(DIRECTION.REVERSE).load();
    $(loading).hide();
    global.word_tree.data(data, true);
    global.word_tree.update();
  }).catch(function(err){
    console.log(err);
  });
});
