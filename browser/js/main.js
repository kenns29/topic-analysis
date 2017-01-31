global.service_url = require('./service');
global.UI_year_select = require('./UI/year_select');
global.document_viewer = require('./view/document_viewer');
global.topic_viewer = require('./view/topic_viewer');
global.model_stats_display = require('./view/model_stats_display');
require('./UI/btn_load_papers');
require('./UI/btn_load_panels')
require('./UI/btn_train_topics');

global.model_stats_display.load().then(function(data){
  global.model_stats_display.data(data).update();
});
