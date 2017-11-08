!function(n){function e(t){if(r[t])return r[t].exports;var _=r[t]={i:t,l:!1,exports:{}};return n[t].call(_.exports,_,_.exports,e),_.l=!0,_.exports}var r={};e.m=n,e.c=r,e.d=function(n,r,t){e.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:t})},e.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(r,"a",r),r},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/dist/",e(e.s=1)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval('function copyAttrib(from, to) {\r\n    if (!from instanceof Object) return;\r\n    if (!to instanceof Object) return;\r\n    for (var i in from) {\r\n        var obj = from[i];\r\n        if (obj instanceof Object && !(obj instanceof Array)) {\r\n            copyAttrib(obj, to[i]);\r\n        } else to[i] = obj;\r\n    }\r\n}\r\n\r\nfunction dom(tag, modifiers, parent) {\r\n    var element = document.createElement(tag);\r\n    copyAttrib(modifiers, element);\r\n    if (parent instanceof Element) parent.appendChild(element);\r\n    return element;\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__["a"] = (dom);\n\n//////////////////\n// WEBPACK FOOTER\n// ./source/cee/dom.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./source/cee/dom.js?')},function(module,__webpack_exports__,__webpack_require__){"use strict";eval('Object.defineProperty(__webpack_exports__, "__esModule", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cee_main__ = __webpack_require__(2);\n\r\nwindow.Cee = __WEBPACK_IMPORTED_MODULE_0__cee_main__["a" /* default */];\n\n//////////////////\n// WEBPACK FOOTER\n// ./source/entry/cee.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./source/entry/cee.js?')},function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(0);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__table__ = __webpack_require__(3);\n\r\n\r\nfunction Cee(element, width, height) {\r\n    var table = Object(__WEBPACK_IMPORTED_MODULE_1__table__["a" /* default */])(element, width, height);\r\n\r\n    function render(str) {\r\n        table.map((div, i) => {\r\n            div.textContent = str[i];\r\n        })\r\n    }\r\n\r\n    table.map((div, i) => {\r\n        var id = i;\r\n        div.onclick = function () {\r\n            on.click(id)\r\n        }\r\n        div.onmousedown = function () {\r\n            div.mousedown = true;\r\n            on.down();\r\n        }\r\n        div.onmouseup = function () {\r\n            div.mousedown = false;\r\n            on.up();\r\n        }\r\n        div.onmouseenter = function () {\r\n            div.mouseover = true;\r\n            on.in(id);\r\n        }\r\n        div.onmouseleave = function () {\r\n            div.mouseover = false;\r\n            on.out(id);\r\n        }\r\n    })\r\n\r\n    var on = {\r\n        click() { },\r\n        in() { },\r\n        out() { },\r\n        down() { },\r\n        up() { }\r\n    }\r\n\r\n    var is = {\r\n        over(id) {\r\n            return table[id].mouseover\r\n        },\r\n        down(id) {\r\n            return table[id].mousedown\r\n        }\r\n    }\r\n\r\n    return {\r\n        render,\r\n        on,\r\n        is\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__["a"] = (Cee);\n\n//////////////////\n// WEBPACK FOOTER\n// ./source/cee/main.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./source/cee/main.js?')},function(module,__webpack_exports__,__webpack_require__){"use strict";eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(0);\n\r\n/* harmony default export */ __webpack_exports__[\"a\"] = (function (element, width, height) {\r\n    var array = [];\r\n    if (typeof element == 'string') element = document.querySelector(element) || document.getElementById(element);\r\n    var table = Object(__WEBPACK_IMPORTED_MODULE_0__dom__[\"a\" /* default */])('table', {\r\n        style: {\r\n            fontFamily: 'consolas',\r\n            fontSize: '45px',\r\n            margin: 0,\r\n            padding: 0,\r\n            borderCollapse: 'collapse'\r\n        }\r\n    }, element);\r\n    for (var i = 0; i < height; i++) {\r\n        var tr = Object(__WEBPACK_IMPORTED_MODULE_0__dom__[\"a\" /* default */])('tr', {\r\n            padding: 0,\r\n            margin: 0\r\n        }, table);\r\n        for (var j = 0; j < width; j++) {\r\n            var td = Object(__WEBPACK_IMPORTED_MODULE_0__dom__[\"a\" /* default */])('td', {\r\n                style: {\r\n                    margin: 0,\r\n                    padding: 0,\r\n                }\r\n            }, tr);\r\n            var div = Object(__WEBPACK_IMPORTED_MODULE_0__dom__[\"a\" /* default */])('div', {\r\n                textContent: ' ',\r\n                style: {\r\n                    width: '25px',\r\n                    height: '50px',\r\n                }\r\n            }, td);\r\n            array.push(div);\r\n        }\r\n    }\r\n    return array;\r\n});\n\n//////////////////\n// WEBPACK FOOTER\n// ./source/cee/table.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///./source/cee/table.js?")}]);