import 'shiny';
import $ from "jquery";

function exportViewportDims() {
  Shiny.setInputValue(
    "viewport_dims", 
    {
      width: window.innerWidth,
      height: window.innerHeight
    }
  );
}

$(document).ready(function(){
  var heatmap, heatmapContainer, heatmapConfig;
  
  // Recover viewport dims to display correct coordinates
  $(document).on('shiny:connected', function() {
    exportViewportDims();
    var isMobile = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      isMobile = true;
    }
    Shiny.setInputValue('isMobile', isMobile);
  });
  
  $(window).resize(function() {
    exportViewportDims();
  });
  
  Shiny.addCustomMessageHandler('initialize_container', function(m) {
    setTimeout(function() {
      heatmapContainer = document.querySelector(m.target);
      if (!!m.track) {
        var eventName;
        if (m.type === "click") {
          eventName = "onclick";
        } else if (m.type === "move") {
          eventName = "onmousemove";
        }
        heatmapContainer[eventName] = function(e) {
          // normalized for screensize
          var tmp_data = {
            x: e.pageX / window.innerWidth,
            y: e.pageY / window.innerHeight,
            value: 1
          };
          Shiny.setInputValue('heatmap_data', tmp_data);
        };
      }
    }, m.timeout);
  });
  
  Shiny.addCustomMessageHandler('add_heatmap_data', function(m) {
    // don't recreate new container if it exists
    if (window.heatmap === undefined) {
      heatmapConfig = m.options || {};
      heatmapConfig.container = heatmapContainer;
      heatmap = h337.create(heatmapConfig);
    }
    
    heatmap.setData({ data: m.data });
    // export heatmap to window (mostly for debug purpose)
    window.heatmap = heatmap;
  });
  
  // Show download UI
  Shiny.addCustomMessageHandler("show_heatmap_ui", function(m) {
    $('.shiny-heatmap-ui').show();
  });
});
