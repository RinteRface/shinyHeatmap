import 'shiny';

window.onload = function() {
  var heatmap;
  var heatmapContainer = document.getElementById('heatmapContainerWrapper');
  heatmapContainer.onclick = function(e) {
    var tmp_data = {
      x: e.layerX,
      y: e.layerY,
      value: 1
    };
    Shiny.setInputValue('heatmap_data', tmp_data);
  };
  
  Shiny.addCustomMessageHandler('add_heatmap_data', function(data) {
    heatmap = h337.create({
      container: document.getElementById('heatmapContainer'),
      radius: 90
    });
    heatmap.setData({
      data: data
    });
  });
  
  Shiny.addCustomMessageHandler('remove_heatmap', function(data) {
    document.getElementsByClassName("heatmap-canvas")[0].remove();
  });
};
