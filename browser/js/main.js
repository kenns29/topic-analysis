global.UI_year_select = require('./UI/year_select');
var TopicDocumentViewer = require('./view/document_viewer/topic_document_viewer');
global.topic_document_viewer = TopicDocumentViewer().init();
var KeywordDocumentViewer = require('./view/document_viewer/keyword_document_viewer');
global.keyword_document_viewer = KeywordDocumentViewer().init();
global.topic_viewer = require('./view/topic_viewer');
global.model_stats_display = require('./view/model_stats_display');
global.user_model_stats_display = require('./view/user_model_stats_display')().init();
var MultiKeywordTimeline = require('./view/multi_keyword_timeline');
global.multi_keyword_timeline = MultiKeywordTimeline().init();
var WordTree = require('./view/word_tree');
global.word_tree = WordTree().init();
var TopicModelCompare = require('./view/topic_model_compare');
global.topic_model_compare = TopicModelCompare().init();
var MultiUserTopicTimeline = require('./view/multi_user_topic_timeline');
global.multi_user_topic_timeline = MultiUserTopicTimeline().init();
var TopKeyWords = require('./view/top_keywords');
global.top_keywords = TopKeyWords().init();

//Controlllers
global.controller_keyword_document_viewer = require('./control/controller_keyword_document_viewer')();
global.controller_keyword = require('./control/controller_keyword')();
global.controller_user_topics = require('./control/controller_user_topics')();

require('./UI/btn_load_papers');
require('./UI/btn_load_panels');
require('./UI/btn_train_topics');
require('./UI/form_upload_user_topics');

var KeywordSelect = require('./UI/keyword_select');
global.keyword_select = KeywordSelect().init();
require('./UI/user_topic_interaction');

require('./UI/wordtree_controls').init_year_select();
require('./UI/btn_draw_wordtree');

require('./UI/document_tab_nav');
require('./UI/keyword_tab_nav');
require('./UI/side_tab_nav');
require('./UI/checkbox_timeline_brush');

require('./init/draw_topic_model_stats');
require('./init/draw_user_topic_model_stats');
require('./init/draw_keyword_timelines');
// require('./init/draw_model_compare');
require('./init/draw_word_tree');
require('./init/draw_top_keyword');
require('./UI/test');
