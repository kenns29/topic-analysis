var $ = require('jquery');
module.exports = exports = function(){
  var name = "doc-tab";
  var selector = 'ul.nav.nav-tabs li[name='+name+']';
  function tab_show(){
    $(this).addClass('active');
    let href = $(this).find('a').attr('href');
    $(href).addClass('in active');
  }
  function tab_hide(){
    $(this).removeClass('active');
    let href = $(this).find('a').attr('href');
    $(href).removeClass('in active');
  }
  function init(){
    $(selector).on('click', click);
    return ret;
  }
	function click(){
    tab_show.call(this);
    $(selector).not(this).each(function(){
      tab_hide.call(this);
    });
	}
	var ret = {};
  ret.init = init;
	ret.click = click;
  ret.name = function(_){
    if(arguments.length > 0){
      return (name = _, selector = 'ul.nav.nav-tabs li[name='+name+']', ret);
    } else {return name;}
  };
  ret.tab_show = function(_){return arguments.length > 0 ?(tab_show =_,ret) : tab_show;};
  ret.tab_hide = function(_){return arguments.length > 0 ?(tab_hide =_,ret) : tab_hide;};
  return ret;
}
