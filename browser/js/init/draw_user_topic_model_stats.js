global.user_model_stats_display.load().then(function(data){
  console.log('user topic data', data);
  global.user_model_stats_display.data(data).update();
});
