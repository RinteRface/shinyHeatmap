import 'shiny';
import $ from "jquery";

$(document).ready(function(){
  var heatmap, heatmapContainer;
  
  Shiny.addCustomMessageHandler('initialize_container', function(data) {
    setTimeout(function() {
      heatmapContainer = document.querySelector(data.target);
      heatmapContainer.onclick = function(e) {
        var tmp_data = {
          x: e.pageX,
          y: e.pageY,
          value: 1
        };
        Shiny.setInputValue('heatmap_data', tmp_data);
      };
    }, data.timeout);
  });
  
  Shiny.addCustomMessageHandler('add_heatmap_data', function(data) {
    heatmap = h337.create({
      container: heatmapContainer//,
    //radius: 90
    });
    heatmap.setData({data: data});
  });
  
  Shiny.addCustomMessageHandler('remove_heatmap', function(data) {
    document.querySelector(".heatmap-canvas").remove();
  });
});
