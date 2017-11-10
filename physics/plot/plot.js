/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_v__ = __webpack_require__(1);

function Plot(width, height) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;

    this.plot = function (setups) {
        if (!(setups instanceof Array)) setups = [setups];



        var margin = 40;
        var plotStart = [margin, canvas.height - margin];
        var plotEnd = [canvas.width - margin, margin];


        var dataStart = null;
        var dataEnd = null;


        for (var setup of setups) {
            for (var i of setup.datapoints) {
                if (dataStart == null) dataStart = i;
                if (dataEnd == null) dataEnd = i;
                dataStart = __WEBPACK_IMPORTED_MODULE_0_v__["a" /* default */].min(dataStart, i);
                dataEnd = __WEBPACK_IMPORTED_MODULE_0_v__["a" /* default */].max(dataEnd, i);
            }
        }

        [0, 1].map(i => {
            if (dataStart[i] > 0 && dataEnd[i] > 0 &&
                dataEnd[i] / 2 > dataStart[i]) dataStart[i] = 0;
            if (dataStart[i] < 0 && dataEnd[i] < 0 &&
                dataStart[i] / 2 < dataEnd[i]) dataEnd[i] = 0;
        })

        var translate = point => [0, 1].map(i =>
            (point[i] - dataStart[i]) *
            (plotEnd[i] - plotStart[i]) /
            (dataEnd[i] - dataStart[i]) + plotStart[i]
        );

        var origin = translate([0, 0]);
        origin = __WEBPACK_IMPORTED_MODULE_0_v__["a" /* default */].min(__WEBPACK_IMPORTED_MODULE_0_v__["a" /* default */].max(origin,
            [plotStart[0], plotEnd[1]]),
            [plotEnd[0], plotStart[1]]);

        var left = origin[0] < canvas.width / 2;
        var top = origin[1] < canvas.height / 2;

        for (var setup of setups) {

            var datapoints = setup.datapoints;


            ctx.strokeStyle = 'black';
            ctx.font = "16px arial";
            ctx.beginPath();
            ctx.moveTo(origin[0], plotStart[1]);
            ctx.lineTo(origin[0], plotEnd[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(plotStart[0], origin[1]);
            ctx.lineTo(plotEnd[0], origin[1]);
            ctx.stroke();

            var prev = null;
            if (setup.mark !== false)
                for (var i of datapoints) {
                    var p = translate(i);

                    ctx.strokeStyle = '#ddd';
                    ctx.beginPath();
                    ctx.moveTo(origin[0], p[1]);
                    ctx.lineTo(p[0], p[1]);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(p[0], origin[1]);
                    ctx.lineTo(p[0], p[1]);
                    ctx.stroke();

                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.moveTo(origin[0] - 5, p[1]);
                    ctx.lineTo(origin[0] + 5, p[1]);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(p[0], origin[1] - 5);
                    ctx.lineTo(p[0], origin[1] + 5);
                    ctx.stroke();

                    ctx.textBaseline = 'middle'
                    ctx.fillStyle = 'black';
                    ctx.textAlign = left ? 'right' : 'left';
                    ctx.fillText(i[0], origin[0] + (left ? - 8 : 8), p[1]);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = top ? 'bottom' : 'top';
                    ctx.fillText(i[0], p[0], origin[1] + (top ? -8 : 8));


                }
            var prev = null;
            for (var i of datapoints) {
                var p = translate(i);
                if (setup.connect !== false) {
                    if (prev) {
                        ctx.strokeStyle = '#2196F3';
                        ctx.beginPath();
                        ctx.moveTo(...p);
                        ctx.lineTo(...prev);
                        ctx.stroke();
                    }
                }
                if (setup.mark !== false) {
                    ctx.fillStyle = '#2196F3';
                    ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5);
                }
                prev = p;
            }
        }
        return this;
    }
}

window.Plot = Plot;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    add(a, b) {
        return a.map((x, i) => x + b[i])
    },
    sub(a, b) {
        return a.map((x, i) => x - b[i])
    },
    multeach(a, b) {
        return a.map((x, i) => x * b[i])
    },
    mult(a, b) {
        return a.map(x => x * b);
    },
    magsq(a) {
        return a[0] * a[0] + a[1] * a[1];
    },
    max(a, b) {
        return a.map((x, i) => Math.max(x, b[i]));
    },
    min(a, b) {
        return a.map((x, i) => Math.min(x, b[i]));
    }
});

/***/ })
/******/ ]);