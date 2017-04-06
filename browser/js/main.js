global.service_url = require('./service');
global.UI_year_select = require('./UI/year_select');
var TopicDocumentViewer = require('./view/document_viewer/topic_document_viewer');
global.topic_document_viewer = TopicDocumentViewer().init();
var KeywordDocumentViewer = require('./view/document_viewer/keyword_document_viewer');
global.keyword_document_viewer = KeywordDocumentViewer().init();
global.topic_viewer = require('./view/topic_viewer');
global.model_stats_display = require('./view/model_stats_display');
var MultiKeywordTimeline = require('./view/multi_keyword_timeline');
global.multi_keyword_timeline = MultiKeywordTimeline().init();
var WordTree = require('./view/word_tree');
global.word_tree = WordTree().init();
var TopicModelCompare = require('./view/topic_model_compare');
global.topic_model_compare = TopicModelCompare().init();

//Controlllers
global.controller_keyword_document_viewer = require('./control/controller_keyword_document_viewer')();
global.controller_keyword = require('./control/controller_keyword')();

require('./UI/btn_load_papers');
require('./UI/btn_load_panels')
require('./UI/btn_train_topics');

global.model_stats_display.load().then(function(data){
  global.model_stats_display.data(data).update();
});
var KeywordSelect = require('./UI/keyword_select');
global.keyword_select = KeywordSelect().init();
require('./UI/wordtree_controls').init_year_select();
require('./UI/btn_draw_wordtree');

require('./UI/document_tab_nav');
require('./UI/keyword_tab_nav');
require('./UI/checkbox_timeline_brush');
require('./UI/checkbox_timeline_percent');
require('./init/draw_keyword_timelines')();
// require('./init/draw_model_compare')();
require('./init/draw_word_tree')();
// require('./UI/test');
