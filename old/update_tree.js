function update_tree(hierarchy, source, reverse){
  var root = hierarchy.root();
  var nodes = root.descendants(),
      links = root.descendants().slice(1);
  //Entering the necessary nodes and append texts, and compute the font and text length for each node
  var node_sel = graph_g.selectAll('.node').data(nodes, function(d){return d.id || (d.id = ++last_id);});
  var node_enter = node_sel.enter().append('g').attr('class', 'node');
  node_enter.append('text');
  var node_exit = node_sel.exit();
  if(!node_exit.empty()) node_exit.transition().duration(duration).attr('transform', function(d){
    return 'translate('+[0, 0]+')';
  });
  var node_update = node_sel.merge(node_enter);
  node_update.select('text').attr('dominant-baseline', 'middle').attr('font-size', function(d){
    return hierarchy.count2font(d.data.count);
  });
  var tspan_sel = node_update.select('text').selectAll('tspan').data(function(d){return d.data.tokens;}, function(d){return d.text;});
  var tspan_enter = tspan_sel.enter().append('tspan');
  var tspan_exit = tspan_sel.exit();
  if(!tspan_exit.empty()) tspan_exit.remove();
  var tspan_update = tspan_sel.merge(tspan_enter);
  tspan_update.html(function(d, i){
    if(i === 0) return d.text; else return '&nbsp;' + d.text;
  });
  node_update.each(function(d){
    d.data.text_length = d.text_length = d3.select(this).select('text').node().getComputedTextLength();
  });

  //update the layout
  width = $(container).width(), height = $(container).height();
  var layout_height = hierarchy.height() > height ? hierarchy.height() : height;
  var partition = Partition().hierarchy(hierarchy).reverse(reverse).height(layout_height).width(width).update();
  partition.move_y(width/2);

  //update nodes
  node_update.transition().duration(duration).attr('transform', function(d){
    return 'translate('+[d.y, d.x]+')';
  });
  node_update.on('mouseover', function(d){
    tooltip.show(svg.node(), d.data.tokens[0].text + ', value ' + d.value + ', count ' + d.data.count + ', font ' + hierarchy.count2font(d.data.count));
  }).on('mousemove', function(){
    tooltip.move(svg.node());
  }).on('mouseout', function(){
    tooltip.hide();
  });

  //update links
  var link_sel = graph_g.selectAll('.link').data(links, function(d){return d.id;});
  var link_enter = link_sel.enter().append('path').attr('class', 'link')
  .attr('d', function(d){
    var o = {x : 0, y:0};
    return diagonal(o, o);
  }).attr('fill', 'none')
  .attr('stroke', 'black')
  .attr('stroke-width', 1);
  var link_exit = link_sel.exit();
  if(!link_exit.empty()) link_exit.remove();
  var link_update = link_sel.merge(link_enter);
  link_update.transition().duration(duration).attr('d', function(d){
    var s = {x:d.parent.x, y : d.parent.y + d.parent.text_length + 5};
    var t = {x:d.x, y:d.y - 5};
    return diagonal(s, t);
  });
  return ret;
}
