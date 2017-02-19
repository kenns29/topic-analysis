var $ = require('jquery');
var d3 = require('../load_d3');
var DOC = require('../../../flags/doc_flags');
var LoadWordTree = require('../load/load_word_tree');
var co = require('co');
var DIRECTION = require('../../../flags/word_tree_direction_flags');
module.exports = exports = $('#test').click(function(){
  co(function*(){
    var data = yield LoadWordTree().root_word('womans').year(-1)
    .direction(DIRECTION.REVERSE).load();
    console.log('data', JSON.stringify(data));
  }).catch(function(err){
    console.log(err);
  });
});
