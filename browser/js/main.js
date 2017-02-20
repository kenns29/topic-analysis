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
require('./UI/btn_load_papers');
require('./UI/btn_load_panels')
require('./UI/btn_train_topics');

global.model_stats_display.load().then(function(data){
  global.model_stats_display.data(data).update();
});
var KeywordSelect = require('./UI/keyword_select');
global.keyword_select = KeywordSelect().init();

require('./UI/document_tab_nav');
require('./UI/checkbox-timeline-brush');
require('./test_code/draw_keyword_timelines')();