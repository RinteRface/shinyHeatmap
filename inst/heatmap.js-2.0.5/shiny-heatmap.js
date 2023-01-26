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
  var heatmaps = [];
  var heatmapContainer, heatmapConfig;
  
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
    if (heatmaps[m.id] === undefined) {
      heatmapConfig = m.options || {};
      heatmapConfig.container = heatmapContainer;
      var heatmap = h337.create(heatmapConfig);
      jquery__WEBPACK_IMPORTED_MODULE_1___default()(document).trigger("heatmap-added");
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
    heatmaps[m.id] = heatmap;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbnktaGVhdG1hcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05lO0FBQ1E7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSw2Q0FBQztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEVBQUUsNkNBQUM7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDZDQUFDO0FBQ1AsOEJBQThCLDZDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsUUFBUSw2Q0FBQztBQUNULE9BQU87O0FBRVA7QUFDQSxRQUFRLDZDQUFDO0FBQ1QsT0FBTzs7QUFFUCxNQUFNLDZDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsY0FBYztBQUNwQztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUUsNkNBQUM7QUFDSCxJQUFJLDZDQUFDO0FBQ0wsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaGlueUhlYXRtYXAvZXh0ZXJuYWwgdmFyIFwiU2hpbnlcIiIsIndlYnBhY2s6Ly9zaGlueUhlYXRtYXAvZXh0ZXJuYWwgdmFyIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vc2hpbnlIZWF0bWFwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NoaW55SGVhdG1hcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zaGlueUhlYXRtYXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NoaW55SGVhdG1hcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NoaW55SGVhdG1hcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NoaW55SGVhdG1hcC8uL3NyY2pzL2V4dHMvc2hpbnktaGVhdG1hcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFNoaW55OyIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJ3NoaW55JztcbmltcG9ydCAkIGZyb20gXCJqcXVlcnlcIjtcblxuZnVuY3Rpb24gZXhwb3J0Vmlld3BvcnREaW1zKCkge1xuICBTaGlueS5zZXRJbnB1dFZhbHVlKFxuICAgIFwidmlld3BvcnRfZGltc1wiLCBcbiAgICB7XG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIH1cbiAgKTtcbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgdmFyIGhlYXRtYXBzID0gW107XG4gIHZhciBoZWF0bWFwQ29udGFpbmVyLCBoZWF0bWFwQ29uZmlnO1xuICBcbiAgLy8gUmVjb3ZlciB2aWV3cG9ydCBkaW1zIHRvIGRpc3BsYXkgY29ycmVjdCBjb29yZGluYXRlc1xuICAkKGRvY3VtZW50KS5vbignc2hpbnk6Y29ubmVjdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgZXhwb3J0Vmlld3BvcnREaW1zKCk7XG4gICAgdmFyIGlzTW9iaWxlID0gZmFsc2U7XG4gICAgaWYoIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSApIHtcbiAgICAgIGlzTW9iaWxlID0gdHJ1ZTtcbiAgICB9XG4gICAgU2hpbnkuc2V0SW5wdXRWYWx1ZSgnaXNNb2JpbGUnLCBpc01vYmlsZSk7XG4gIH0pO1xuICBcbiAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICBleHBvcnRWaWV3cG9ydERpbXMoKTtcbiAgfSk7XG4gIFxuICBTaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcignaW5pdGlhbGl6ZV9jb250YWluZXInLCBmdW5jdGlvbihtKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGhlYXRtYXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG0udGFyZ2V0KTtcbiAgICAgIGlmICghIW0udHJhY2spIHtcbiAgICAgICAgdmFyIGV2ZW50TmFtZTtcbiAgICAgICAgaWYgKG0udHlwZSA9PT0gXCJjbGlja1wiKSB7XG4gICAgICAgICAgZXZlbnROYW1lID0gXCJvbmNsaWNrXCI7XG4gICAgICAgIH0gZWxzZSBpZiAobS50eXBlID09PSBcIm1vdmVcIikge1xuICAgICAgICAgIGV2ZW50TmFtZSA9IFwib25tb3VzZW1vdmVcIjtcbiAgICAgICAgfVxuICAgICAgICBoZWF0bWFwQ29udGFpbmVyW2V2ZW50TmFtZV0gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy8gbm9ybWFsaXplZCBmb3Igc2NyZWVuc2l6ZVxuICAgICAgICAgIHZhciB0bXBfZGF0YSA9IHtcbiAgICAgICAgICAgIHg6IGUucGFnZVggLyB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgICAgIHk6IGUucGFnZVkgLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgICB2YWx1ZTogMVxuICAgICAgICAgIH07XG4gICAgICAgICAgU2hpbnkuc2V0SW5wdXRWYWx1ZSgnaGVhdG1hcF9kYXRhJywgdG1wX2RhdGEpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIG0udGltZW91dCk7XG4gIH0pO1xuICBcbiAgU2hpbnkuYWRkQ3VzdG9tTWVzc2FnZUhhbmRsZXIoJ2FkZF9oZWF0bWFwX2RhdGEnLCBmdW5jdGlvbihtKSB7XG4gICAgLy8gZG9uJ3QgcmVjcmVhdGUgbmV3IGNvbnRhaW5lciBpZiBpdCBleGlzdHNcbiAgICBpZiAoaGVhdG1hcHNbbS5pZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGVhdG1hcENvbmZpZyA9IG0ub3B0aW9ucyB8fCB7fTtcbiAgICAgIGhlYXRtYXBDb25maWcuY29udGFpbmVyID0gaGVhdG1hcENvbnRhaW5lcjtcbiAgICAgIHZhciBoZWF0bWFwID0gaDMzNy5jcmVhdGUoaGVhdG1hcENvbmZpZyk7XG4gICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKFwiaGVhdG1hcC1hZGRlZFwiKTtcbiAgICAgIHZhciAkaGVhdG1hcFVJVHJpZ2dlciA9ICQoJzxidXR0b24gaWQ9XCJoZWF0bWFwVUlUcmlnZ2VyXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYWN0aW9uLWJ1dHRvblwiPkhlYXRtYXA8L2J1dHRvbj4nKTtcbiAgICAgICRoZWF0bWFwVUlUcmlnZ2VyLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICB0b3A6ICcyMHB4JyxcbiAgICAgICAgcmlnaHQ6ICc1MHB4JyxcbiAgICAgICAgaGVpZ2h0OiAnNDBweCcsXG4gICAgICAgICdib3JkZXItcmFkaXVzJzogJzVweCcsXG4gICAgICAgICd6LWluZGV4JzogJzk5OTk5JyxcbiAgICAgICAgb3BhY2l0eTogJy43J1xuICAgICAgfSk7XG5cbiAgICAgICRoZWF0bWFwVUlUcmlnZ2VyLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsICcxJyk7XG4gICAgICB9KTtcblxuICAgICAgJGhlYXRtYXBVSVRyaWdnZXIub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsICcuNycpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJ2JvZHknKS5hcHBlbmQoJGhlYXRtYXBVSVRyaWdnZXIpO1xuICAgICAgLy8gRG9uJ3QgZm9yZ2V0IHRvIGJpbmQgbmV3IHNoaW55IGlucHV0XG4gICAgICBTaGlueS5iaW5kQWxsKCk7XG4gICAgfVxuICAgIFxuICAgIGhlYXRtYXAuc2V0RGF0YSh7IGRhdGE6IG0uZGF0YSB9KTtcbiAgICAvLyBleHBvcnQgaGVhdG1hcCB0byB3aW5kb3cgKG1vc3RseSBmb3IgZGVidWcgcHVycG9zZSlcbiAgICBoZWF0bWFwc1ttLmlkXSA9IGhlYXRtYXA7XG4gIH0pO1xuICBcbiAgLy8gc2V0IHotaW5kZXggdG8gbWFrZSBzdXJlIGl0IGlzIGFsd2F5cyB2aXNpYmxlXG4gIC8vIE11c3QgYmUgYmVsb3cgdGhlIGRvd25sb2FkIGJ1dHRvbiB3aXRoIDk5OTk5IHotaW5kZXguXG4gICQoZG9jdW1lbnQpLm9uKCdoZWF0bWFwLWFkZGVkJywgZnVuY3Rpb24obSkge1xuICAgICQoXCIuaGVhdG1hcC1jYW52YXNcIikuY3NzKFwiei1pbmRleFwiLCA5OTk5OCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=