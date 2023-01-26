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
      
      $(document).trigger("heatmap-added");
      
      var $heatmapUITrigger;
      if (m.showUI) {
        $heatmapUITrigger = $('<button id="heatmapUITrigger" type="button" class="action-button">Heatmap options</button>');
        $heatmapUITrigger.css({
          position: 'fixed',
          top: '20px',
          right: '140px',
          height: '40px',
          'border-radius': '5px',
          'z-index': '99999',
          opacity: '.7'
        });
      }
      
      var $toggleHeatmap = $('<button id="toggleHeatmapTrigger" type="button" class="action-button bg-grey">Toggle heatmap</button>');
      
      $toggleHeatmap.css({
        position: 'fixed',
        top: '20px',
        right: '20px',
        height: '40px',
        'border-radius': '5px',
        'z-index': '99999',
        opacity: '.7'
      });
      
      $toggleHeatmap.add($heatmapUITrigger).on('mouseenter', function () {
        $(this).css('opacity', '1');
      });

      $toggleHeatmap.add($heatmapUITrigger).on('mouseout', function () {
        $(this).css('opacity', '.7');
      });
      
      // Give possibility to hide heatmap
      $toggleHeatmap.on('click', function() {
        $('.heatmap-canvas').toggle();
      });

      $('body').append([$heatmapUITrigger, $toggleHeatmap]);
      // Don't forget to bind new shiny input
      Shiny.bindAll();
    }
    
    // Show canvas each time data are updated
    if($('.heatmap-canvas').is(':visible') === false) {
      $('.heatmap-canvas').show();
    }
    
    heatmap.setData({ data: m.data });
    // export heatmap to window (mostly for debug purpose)
    window.heatmap = heatmap;
  });
  
  // set z-index to make sure it is always visible
  // Must be below the download button with 99999 z-index.
  $(document).on('heatmap-added', function(m) {
    $(".heatmap-canvas").css("z-index", 99998);
  });
});
