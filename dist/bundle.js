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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = __webpack_require__(2);
var worm_1 = __webpack_require__(3);
// size
var WIDTH = 800;
var HEIGHT = 400;
var SCALE = 2;
// movement speed
var INITIAL_SPEED = 50;
var SPEED_CHANGE = 4;
var MINIMUM_SPEED = 15;
// levels
var MAX_LEVEL = 10;
// level background colors
exports.COLORS = ['#fafafa', '#ffffcc', '#ffe6ee', '#e6f2ff', '#e6ffe6', '#fff0e6', '#e6e6ff', '#f9f2ec', '#e6ffe6', '#ff4d4d'];

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.level = 0;
        this.score = 0;
        this.speed = INITIAL_SPEED;
        this.turbo = false;
        this.running = false;
        this.canvas = document.createElement('Canvas');
        document.body.appendChild(this.canvas);
        // canvas element size in the page
        //this.canvas.style.width = WIDTH + 'px';
        //this.canvas.style.height = HEIGHT + 'px';
        // image buffer size 
        this.canvas.width = WIDTH * SCALE;
        this.canvas.height = HEIGHT * SCALE;
        // save size
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.worm = new worm_1.default(this);
        this.map = new map_1.default(this);
        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    _createClass(Game, [{
        key: "start",
        value: function start() {
            this.nextMove = 0;
            this.running = true;
            requestAnimationFrame(this.loop.bind(this));
        }
    }, {
        key: "stop",
        value: function stop() {
            this.running = false;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.height;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this.width;
        }
    }, {
        key: "getLevel",
        value: function getLevel() {
            return this.level;
        }
    }, {
        key: "loop",
        value: function loop(time) {
            if (this.running) {
                requestAnimationFrame(this.loop.bind(this));
                if (this.turbo || time >= this.nextMove) {
                    this.nextMove = time + this.speed;
                    // move once
                    this.worm.move();
                    // check what happened  
                    this.checkState();
                    // repaint
                    this.paint(time);
                }
            }
        }
    }, {
        key: "paint",
        value: function paint(time) {
            var width = this.width,
                height = this.height,
                level = this.level;

            var color = exports.COLORS[level];
            var context = this.canvas.getContext("2d");
            // global settings
            context.lineWidth = 1 * SCALE;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            // background
            context.fillStyle = color;
            context.fillRect(0, 0, width, height);
            // level
            context.font = height + 'px Arial';
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillStyle = 'rgba(0,0,0,0.1)';
            context.fillText(level + 1 + '', width / 2, height / 2);
            // score
            context.font = 20 * SCALE + 'px Arial';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillStyle = 'rgba(0,0,0,0.25)';
            context.fillText(this.score + '', 10 * SCALE, 10 * SCALE);
            // map items
            this.map.draw(time, context);
            // worm
            this.worm.draw(time, context);
        }
    }, {
        key: "checkState",
        value: function checkState() {
            var _this = this;

            var head = this.worm.getHead();
            // left the play area or ate itself?
            if (this.isOutside(head) || this.worm.isWorm(head)) {
                // dead
                this.die();
                return;
            }
            // got items?
            var items = this.map.getItemsAt(head);
            if (items != undefined && items.length > 0) {
                this.score += items.length * 100;
                // apply item effects
                items.forEach(function (item) {
                    switch (item.type) {
                        case 'GROW':
                            _this.worm.grow();
                            break;
                        case 'SHRINK':
                            _this.worm.shrink();
                            break;
                        case 'SPEED':
                            _this.speedUp();
                            break;
                        case 'SLOW':
                            _this.slowDown();
                            break;
                    }
                });
                this.map.removeItems(items);
                // all gone?
                if (!this.map.hasItems()) {
                    this.levelUp();
                }
            }
        }
    }, {
        key: "levelUp",
        value: function levelUp() {
            this.score += 1000;
            this.level++;
            if (this.level < MAX_LEVEL) {
                this.speedUp();
                this.map.seed();
            } else {
                this.win();
            }
        }
    }, {
        key: "win",
        value: function win() {
            alert("Congrats you beat the game!\r\nFinal Score: " + this.score);
            this.stop();
        }
    }, {
        key: "die",
        value: function die() {
            alert("You died.\r\nFinal Score: " + this.score);
            this.stop();
        }
    }, {
        key: "speedUp",
        value: function speedUp() {
            this.speed = Math.max(MINIMUM_SPEED, this.speed - SPEED_CHANGE);
        }
    }, {
        key: "slowDown",
        value: function slowDown() {
            this.speed = Math.min(INITIAL_SPEED, this.speed + SPEED_CHANGE);
        }
    }, {
        key: "isOutside",
        value: function isOutside(position) {
            return position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height;
        }
    }, {
        key: "onKeyDown",
        value: function onKeyDown(event) {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    this.worm.setDirection('Up');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.worm.setDirection('Down');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.worm.setDirection('Left');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.worm.setDirection('Right');
                    break;
                case ' ':
                    event.preventDefault();
                    this.turbo = true;
                    break;
            }
        }
    }, {
        key: "onKeyUp",
        value: function onKeyUp(event) {
            switch (event.key) {
                case ' ':
                    this.turbo = false;
                    break;
            }
        }
    }, {
        key: "onTouchStart",
        value: function onTouchStart(e) {
            this.touch = e.changedTouches[0];
            e.preventDefault();
        }
    }, {
        key: "onTouchMove",
        value: function onTouchMove(e) {
            e.preventDefault();
        }
    }, {
        key: "onTouchEnd",
        value: function onTouchEnd(e) {
            var touch = e.changedTouches[0];
            var distX = touch.pageX - this.touch.pageX;
            var distY = touch.pageY - this.touch.pageY;
            var direction = null;
            if (Math.abs(distX) >= 100) {
                direction = distX < 0 ? 'Left' : 'Right';
            } else if (Math.abs(distY) >= 100) {
                direction = distY < 0 ? 'Up' : 'Down';
            }
            if (direction) {
                this.worm.setDirection(direction);
            }
            e.preventDefault();
        }
    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
window.focus();
var game = new game_1.default();
game.start();
// global var
window.game = game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var COLORS = {
    GROW: 'blue',
    SHRINK: 'black',
    SPEED: 'green',
    SLOW: 'red'
};

var Item = function () {
    function Item(x, y, type) {
        _classCallCheck(this, Item);

        this.x = x;
        this.y = y;
        this.type = type;
    }

    _createClass(Item, [{
        key: "compare",
        value: function compare(other) {
            return this.x == other.x && this.y == other.y;
        }
    }]);

    return Item;
}();

exports.Item = Item;
var ITEMS_PER_LEVEL = 5;
var ITEMS_SIZE = 10;

var Map = function () {
    function Map(game) {
        _classCallCheck(this, Map);

        this.game = game;
        this.items = [];
        this.seed();
    }

    _createClass(Map, [{
        key: "seed",
        value: function seed() {
            var width = this.game.getWidth();
            var height = this.game.getHeight();
            var nbItems = ITEMS_PER_LEVEL * (this.game.getLevel() + 1);
            var widthWithPadding = width - 2 * ITEMS_SIZE;
            var heightWidthPadding = height - 2 * ITEMS_SIZE;
            for (var count = 0; count < nbItems; count++) {
                // item position
                var x = ITEMS_SIZE + Math.floor(Math.random() * widthWithPadding);
                var y = ITEMS_SIZE + Math.floor(Math.random() * heightWidthPadding);
                // item type            
                var roll = Math.random() * 100;
                var type = roll < 70 ? 'GROW' : roll < 80 ? 'SHRINK' : roll < 95 ? 'SPEED' : 'SLOW';
                this.items.push(new Item(x, y, type));
            }
        }
    }, {
        key: "draw",
        value: function draw(time, context) {
            context.fillStyle = 'red';
            var betterItemSize = ITEMS_SIZE * 2 / 3;
            this.items.forEach(function (item) {
                context.fillStyle = COLORS[item.type];
                context.fillRect(item.x - betterItemSize, item.y - betterItemSize, betterItemSize * 2, betterItemSize * 2);
            });
        }
    }, {
        key: "getItemsAt",
        value: function getItemsAt(point) {
            return this.items.filter(function (item) {
                return point.x >= item.x - ITEMS_SIZE && point.y >= item.y - ITEMS_SIZE && point.x <= item.x + ITEMS_SIZE && point.y <= item.y + ITEMS_SIZE;
            });
        }
    }, {
        key: "removeItems",
        value: function removeItems(items) {
            this.items = this.items.filter(function (item) {
                return !items.find(function (toRemove) {
                    return toRemove.compare(item);
                });
            });
        }
    }, {
        key: "hasItems",
        value: function hasItems() {
            return this.items.length > 0;
        }
    }]);

    return Map;
}();

exports.default = Map;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var INITIAL_LENGTH = 300;
var INITIAL_DIRECTION = 'Right';
var INITIAL_POSITION = { x: 50, y: 50 };
var SIZE = 7;
var MOVEMENT = 5;

var Point = function () {
    function Point(x, y, direction) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    _createClass(Point, [{
        key: "compare",
        value: function compare(other) {
            return this.x == other.x && this.y == other.y;
        }
    }]);

    return Point;
}();

exports.Point = Point;

var Worm = function () {
    function Worm(game) {
        _classCallCheck(this, Worm);

        this.game = game;
        this.size = INITIAL_LENGTH;
        this.direction = INITIAL_DIRECTION;
        // initial head
        this.head = new Point(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_DIRECTION);
        // initial tail
        this.tail = [new Point(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_DIRECTION)];
    }

    _createClass(Worm, [{
        key: "setDirection",
        value: function setDirection(direction) {
            if (this.direction == 'Up' && (direction == 'Down' || direction == 'Up')) {
                return;
            }
            if (this.direction == 'Down' && (direction == 'Up' || direction == 'Down')) {
                return;
            }
            if (this.direction == 'Left' && (direction == 'Right' || direction == 'Left')) {
                return;
            }
            if (this.direction == 'Right' && (direction == 'Left' || direction == 'Right')) {
                return;
            }
            this.direction = direction;
        }
    }, {
        key: "move",
        value: function move() {
            var direction = this.direction;
            if (direction != this.head.direction) {
                this.tail.push(this.head);
            }
            // get next head position
            this.head = this.getNext(direction);
            // fix the worm size
            if (this.getSize() > this.size) {
                var tailEnd = this.tail[0];
                var nextPoint = this.tail.length > 1 ? this.tail[1] : this.head;
                switch (nextPoint.direction) {
                    case 'Up':
                        tailEnd.y -= MOVEMENT;
                        break;
                    case 'Down':
                        tailEnd.y += MOVEMENT;
                        break;
                    case 'Left':
                        tailEnd.x -= MOVEMENT;
                        break;
                    case 'Right':
                        tailEnd.x += MOVEMENT;
                        break;
                }
                // remove tail end if the tail end is now at the same location as next point
                if (tailEnd.y == nextPoint.y && tailEnd.x == nextPoint.x) {
                    this.tail.splice(0, 1);
                }
            }
        }
    }, {
        key: "getSize",
        value: function getSize() {
            var points = [].concat(_toConsumableArray(this.tail), [this.head]);
            var size = 0;
            for (var i = 0; i < points.length - 1; i++) {
                var p1 = points[i];
                var p2 = points[i + 1];
                size += Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
            }
            return size;
        }
    }, {
        key: "getNext",
        value: function getNext(direction) {
            switch (direction) {
                case 'Up':
                    return new Point(this.head.x, this.head.y - MOVEMENT, direction);
                case 'Right':
                    return new Point(this.head.x + MOVEMENT, this.head.y, direction);
                case 'Down':
                    return new Point(this.head.x, this.head.y + MOVEMENT, direction);
                case 'Left':
                    return new Point(this.head.x - MOVEMENT, this.head.y, direction);
            }
        }
    }, {
        key: "draw",
        value: function draw(time, context) {
            var _head = this.head,
                x = _head.x,
                y = _head.y;

            var offset = SIZE * 2 / 3;
            // tail
            context.strokeStyle = "#333333";
            context.lineWidth = SIZE * 2;
            context.beginPath();
            context.moveTo(x, y);
            for (var i = this.tail.length - 1; i >= 0; i--) {
                var point = this.tail[i];
                context.lineTo(point.x, point.y);
            }
            context.stroke();
            // head
            context.fillStyle = "#111111";
            context.beginPath();
            context.arc(x, y, SIZE + 0.5, 0, 2 * Math.PI, false);
            context.fill();
            // eyes
            switch (this.direction[0]) {
                case 'Up':
                    context.beginPath();
                    context.arc(x + offset, y + offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.arc(x + 2 * offset, y + offset, SIZE, 0, 2 * Math.PI, false);
                    context.fillStyle = 'white';
                    context.fill();
                    break;
                case 'Down':
                    context.beginPath();
                    context.arc(x + offset, y + 2 * offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.arc(x + 2 * offset, y + 2 * offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.fillStyle = 'white';
                    context.fill();
                    break;
                case 'Right':
                    context.beginPath();
                    context.arc(x + 2 * offset, y + offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.arc(x + 2 * offset, y + 2 * offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.fillStyle = 'white';
                    context.fill();
                    break;
                case 'Left':
                    context.beginPath();
                    context.arc(x + offset, y + offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.arc(x + offset, y + 2 * offset, SIZE / 4, 0, 2 * Math.PI, false);
                    context.fillStyle = 'white';
                    context.fill();
                    break;
            }
        }
    }, {
        key: "grow",
        value: function grow() {
            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

            this.size += qty * SIZE * 3;
        }
    }, {
        key: "shrink",
        value: function shrink() {
            var qty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

            this.size -= qty * SIZE * 3;
        }
    }, {
        key: "getHead",
        value: function getHead() {
            return { x: this.head.x, y: this.head.y };
        }
    }, {
        key: "isWorm",
        value: function isWorm(point) {
            for (var i = 0; i < this.tail.length - 1; i++) {
                var p1 = this.tail[i];
                var p2 = this.tail[i + 1];
                if (point.x >= p1.x && point.x <= p2.x && point.y == p1.y && point.y == p2.y) {
                    return true;
                }
                if (point.y >= p1.y && point.y <= p2.y && point.x == p1.x && point.x == p2.x) {
                    return true;
                }
            }
            return false;
        }
    }]);

    return Worm;
}();

exports.default = Worm;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map