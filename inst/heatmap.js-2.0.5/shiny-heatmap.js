/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "shiny":
/*!************************!*\
  !*** external "Shiny" ***!
  \************************/
/***/ ((module) => {

module.exports = Shiny;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./srcjs/exts/shiny-heatmap.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shiny */ "shiny");
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shiny__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);



function exportViewportDims() {
  Shiny.setInputValue(
    "viewport_dims", 
    {
      width: window.innerWidth,
      height: window.innerHeight
    }
  );
}

jquery__WEBPACK_IMPORTED_MODULE_1___default()(document).ready(function(){
  var heatmap, heatmapContainer, heatmapConfig;
  
  // Recover viewport dims to display correct coordinates
  jquery__WEBPACK_IMPORTED_MODULE_1___default()(document).on('shiny:connected', function() {
    exportViewportDims();
    var isMobile = false;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      isMobile = true;
    }
    Shiny.setInputValue('isMobile', isMobile);
  });
  
  jquery__WEBPACK_IMPORTED_MODULE_1___default()(window).resize(function() {
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
      //$(document).trigger("heatmap-added");
      var $heatmapUITrigger = jquery__WEBPACK_IMPORTED_MODULE_1___default()('<button id="heatmapUITrigger" type="button" class="action-button">Heatmap</button>');
      $heatmapUITrigger.css({
        position: 'fixed',
        top: '20px',
        right: '50px',
        height: '40px',
        'border-radius': '5px',
        'z-index': '99999',
        opacity: '.7'
      });

      $heatmapUITrigger.on('mouseenter', function () {
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).css('opacity', '1');
      });

      $heatmapUITrigger.on('mouseout', function () {
        jquery__WEBPACK_IMPORTED_MODULE_1___default()(this).css('opacity', '.7');
      });

      jquery__WEBPACK_IMPORTED_MODULE_1___default()('body').append($heatmapUITrigger);
      // Don't forget to bind new shiny input
      Shiny.bindAll();
    }
    
    heatmap.setData({ data: m.data });
    // export heatmap to window (mostly for debug purpose)
    window.heatmap = heatmap;
  });
  
  // set z-index to make sure it is always visible
  // Must be below the download button with 99999 z-index.
  jquery__WEBPACK_IMPORTED_MODULE_1___default()(document).on('heatmap-added', function(m) {
    jquery__WEBPACK_IMPORTED_MODULE_1___default()(".heatmap-canvas").css("z-index", 99998);
  });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbnktaGVhdG1hcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05lO0FBQ1E7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLEVBQUUsNkNBQUM7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFLDZDQUFDO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsNkNBQUM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxRQUFRLDZDQUFDO0FBQ1QsT0FBTzs7QUFFUDtBQUNBLFFBQVEsNkNBQUM7QUFDVCxPQUFPOztBQUVQLE1BQU0sNkNBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixjQUFjO0FBQ3BDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRSw2Q0FBQztBQUNILElBQUksNkNBQUM7QUFDTCxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NoaW55SGVhdG1hcC9leHRlcm5hbCB2YXIgXCJTaGlueVwiIiwid2VicGFjazovL3NoaW55SGVhdG1hcC9leHRlcm5hbCB2YXIgXCJqUXVlcnlcIiIsIndlYnBhY2s6Ly9zaGlueUhlYXRtYXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2hpbnlIZWF0bWFwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NoaW55SGVhdG1hcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2hpbnlIZWF0bWFwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2hpbnlIZWF0bWFwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2hpbnlIZWF0bWFwLy4vc3JjanMvZXh0cy9zaGlueS1oZWF0bWFwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gU2hpbnk7IiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnc2hpbnknO1xuaW1wb3J0ICQgZnJvbSBcImpxdWVyeVwiO1xuXG5mdW5jdGlvbiBleHBvcnRWaWV3cG9ydERpbXMoKSB7XG4gIFNoaW55LnNldElucHV0VmFsdWUoXG4gICAgXCJ2aWV3cG9ydF9kaW1zXCIsIFxuICAgIHtcbiAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XG4gICAgfVxuICApO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICB2YXIgaGVhdG1hcCwgaGVhdG1hcENvbnRhaW5lciwgaGVhdG1hcENvbmZpZztcbiAgXG4gIC8vIFJlY292ZXIgdmlld3BvcnQgZGltcyB0byBkaXNwbGF5IGNvcnJlY3QgY29vcmRpbmF0ZXNcbiAgJChkb2N1bWVudCkub24oJ3NoaW55OmNvbm5lY3RlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGV4cG9ydFZpZXdwb3J0RGltcygpO1xuICAgIHZhciBpc01vYmlsZSA9IGZhbHNlO1xuICAgIGlmKCAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgKSB7XG4gICAgICBpc01vYmlsZSA9IHRydWU7XG4gICAgfVxuICAgIFNoaW55LnNldElucHV0VmFsdWUoJ2lzTW9iaWxlJywgaXNNb2JpbGUpO1xuICB9KTtcbiAgXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgZXhwb3J0Vmlld3BvcnREaW1zKCk7XG4gIH0pO1xuICBcbiAgU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoJ2luaXRpYWxpemVfY29udGFpbmVyJywgZnVuY3Rpb24obSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBoZWF0bWFwQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihtLnRhcmdldCk7XG4gICAgICBpZiAoISFtLnRyYWNrKSB7XG4gICAgICAgIHZhciBldmVudE5hbWU7XG4gICAgICAgIGlmIChtLnR5cGUgPT09IFwiY2xpY2tcIikge1xuICAgICAgICAgIGV2ZW50TmFtZSA9IFwib25jbGlja1wiO1xuICAgICAgICB9IGVsc2UgaWYgKG0udHlwZSA9PT0gXCJtb3ZlXCIpIHtcbiAgICAgICAgICBldmVudE5hbWUgPSBcIm9ubW91c2Vtb3ZlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaGVhdG1hcENvbnRhaW5lcltldmVudE5hbWVdID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vIG5vcm1hbGl6ZWQgZm9yIHNjcmVlbnNpemVcbiAgICAgICAgICB2YXIgdG1wX2RhdGEgPSB7XG4gICAgICAgICAgICB4OiBlLnBhZ2VYIC8gd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgICAgICB5OiBlLnBhZ2VZIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgdmFsdWU6IDFcbiAgICAgICAgICB9O1xuICAgICAgICAgIFNoaW55LnNldElucHV0VmFsdWUoJ2hlYXRtYXBfZGF0YScsIHRtcF9kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBtLnRpbWVvdXQpO1xuICB9KTtcbiAgXG4gIFNoaW55LmFkZEN1c3RvbU1lc3NhZ2VIYW5kbGVyKCdhZGRfaGVhdG1hcF9kYXRhJywgZnVuY3Rpb24obSkge1xuICAgIC8vIGRvbid0IHJlY3JlYXRlIG5ldyBjb250YWluZXIgaWYgaXQgZXhpc3RzXG4gICAgaWYgKHdpbmRvdy5oZWF0bWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhlYXRtYXBDb25maWcgPSBtLm9wdGlvbnMgfHwge307XG4gICAgICBoZWF0bWFwQ29uZmlnLmNvbnRhaW5lciA9IGhlYXRtYXBDb250YWluZXI7XG4gICAgICBoZWF0bWFwID0gaDMzNy5jcmVhdGUoaGVhdG1hcENvbmZpZyk7XG4gICAgICAvLyQoZG9jdW1lbnQpLnRyaWdnZXIoXCJoZWF0bWFwLWFkZGVkXCIpO1xuICAgICAgdmFyICRoZWF0bWFwVUlUcmlnZ2VyID0gJCgnPGJ1dHRvbiBpZD1cImhlYXRtYXBVSVRyaWdnZXJcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJhY3Rpb24tYnV0dG9uXCI+SGVhdG1hcDwvYnV0dG9uPicpO1xuICAgICAgJGhlYXRtYXBVSVRyaWdnZXIuY3NzKHtcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIHRvcDogJzIwcHgnLFxuICAgICAgICByaWdodDogJzUwcHgnLFxuICAgICAgICBoZWlnaHQ6ICc0MHB4JyxcbiAgICAgICAgJ2JvcmRlci1yYWRpdXMnOiAnNXB4JyxcbiAgICAgICAgJ3otaW5kZXgnOiAnOTk5OTknLFxuICAgICAgICBvcGFjaXR5OiAnLjcnXG4gICAgICB9KTtcblxuICAgICAgJGhlYXRtYXBVSVRyaWdnZXIub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgJzEnKTtcbiAgICAgIH0pO1xuXG4gICAgICAkaGVhdG1hcFVJVHJpZ2dlci5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgJy43Jyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnYm9keScpLmFwcGVuZCgkaGVhdG1hcFVJVHJpZ2dlcik7XG4gICAgICAvLyBEb24ndCBmb3JnZXQgdG8gYmluZCBuZXcgc2hpbnkgaW5wdXRcbiAgICAgIFNoaW55LmJpbmRBbGwoKTtcbiAgICB9XG4gICAgXG4gICAgaGVhdG1hcC5zZXREYXRhKHsgZGF0YTogbS5kYXRhIH0pO1xuICAgIC8vIGV4cG9ydCBoZWF0bWFwIHRvIHdpbmRvdyAobW9zdGx5IGZvciBkZWJ1ZyBwdXJwb3NlKVxuICAgIHdpbmRvdy5oZWF0bWFwID0gaGVhdG1hcDtcbiAgfSk7XG4gIFxuICAvLyBzZXQgei1pbmRleCB0byBtYWtlIHN1cmUgaXQgaXMgYWx3YXlzIHZpc2libGVcbiAgLy8gTXVzdCBiZSBiZWxvdyB0aGUgZG93bmxvYWQgYnV0dG9uIHdpdGggOTk5OTkgei1pbmRleC5cbiAgJChkb2N1bWVudCkub24oJ2hlYXRtYXAtYWRkZWQnLCBmdW5jdGlvbihtKSB7XG4gICAgJChcIi5oZWF0bWFwLWNhbnZhc1wiKS5jc3MoXCJ6LWluZGV4XCIsIDk5OTk4KTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==