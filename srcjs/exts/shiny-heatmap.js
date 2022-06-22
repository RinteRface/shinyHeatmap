import 'shiny';
import $ from "jquery";

$(document).ready(function(){
  var heatmap, heatmapContainer, heatmapConfig;
  
  Shiny.addCustomMessageHandler('initialize_container', function(m) {
    setTimeout(function() {
      heatmapContainer = document.querySelector(m.target);
      var eventName;
      if (m.type === "click") {
        eventName = "onclick";
      } else if (m.type === "move") {
        eventName = "onmousemove";
      }
      heatmapContainer[eventName] = function(e) {
        var tmp_data = {
          x: e.pageX,
          y: e.pageY,
          value: 1
        };
        Shiny.setInputValue('heatmap_data', tmp_data);
      };
    }, m.timeout);
  });
  
  Shiny.addCustomMessageHandler('add_heatmap_data', function(m) {
    heatmapConfig = m.options;
    heatmapConfig.container = heatmapContainer;
    heatmap = h337.create(heatmapConfig);
    heatmap.setData({data: m.data});
  });
  
  Shiny.addCustomMessageHandler('remove_heatmap', function(m) {
    document.querySelector(".heatmap-canvas").remove();
  });
});
