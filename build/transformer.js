"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasTransformer = exports.defaultOptions = void 0;
var listenable_1 = require("./listenable");
exports.defaultOptions = {
    scale: 1,
    offset: new DOMPoint(0, 0),
};
var CanvasTransformer = /** @class */ (function (_super) {
    __extends(CanvasTransformer, _super);
    function CanvasTransformer(canvas, options) {
        if (options === void 0) { options = exports.defaultOptions; }
        var _this = _super.call(this) || this;
        _this.canvas = canvas;
        _this.options = options;
        _this.gestureEvent = false;
        _this.mouse = new DOMPoint(0, 0);
        _this.mouseDown = false;
        _this.shouldNotify = true;
        _this.minScale = 0.1;
        _this.maxScale = 10;
        _this.ctx = _this.canvas.getContext("2d");
        _this.transform = _this.ctx.getTransform();
        _this.shouldNotify = false;
        var scale = options.scale, offset = options.offset;
        _this.scale(scale);
        _this.pan(offset);
        _this.shouldNotify = true;
        // Scroll events
        _this.onWheelEvent = _this.onWheelEvent.bind(_this);
        canvas.addEventListener("wheel", _this.onWheelEvent, { passive: false });
        // Mouse Events
        _this.onMouseDown = _this.onMouseDown.bind(_this);
        canvas.addEventListener("mousedown", _this.onMouseDown, false);
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        canvas.addEventListener("mousemove", _this.onMouseMove, false);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        canvas.addEventListener("mouseup", _this.onMouseUp, false);
        // Touch Events
        _this.onTouchStart = _this.onTouchStart.bind(_this);
        canvas.addEventListener("touchstart", _this.onTouchStart, false);
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        canvas.addEventListener("touchmove", _this.onTouchMove, false);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        canvas.addEventListener("touchend", _this.onTouchEnd, false);
        // TODO: Prevent Safari iPadOS pinch / zoom
        // canvas.addEventListener("gesturestart", this.preventDefault, false);
        // canvas.addEventListener("gesturechange", this.preventDefault, false);
        // canvas.addEventListener("gestureend", this.preventDefault, false);
        // window.addEventListener("scroll", this.preventDefault, { passive: false });
        // Keyboard Events
        _this.onKeyDownEvent = _this.onKeyDownEvent.bind(_this);
        _this.onKeyUpEvent = _this.onKeyUpEvent.bind(_this);
        document.addEventListener("keydown", _this.onKeyDownEvent, false);
        document.addEventListener("keyup", _this.onKeyUpEvent, false);
        return _this;
    }
    Object.defineProperty(CanvasTransformer.prototype, "matrix", {
        get: function () {
            return this.transform;
        },
        set: function (matrix) {
            this.transform = matrix;
            this.notify();
        },
        enumerable: false,
        configurable: true
    });
    CanvasTransformer.prototype.notify = function () {
        if (!this.shouldNotify)
            return;
        this.notifyListeners();
    };
    /**
     * Transforms the mouse coordinates to the local coordinates of the canvas
     *
     * @param point X and Y coordinates of the vector
     */
    CanvasTransformer.prototype.localPoint = function (point) {
        var _a = this.info, scale = _a.scale, offset = _a.offset;
        var x = point.x / scale - offset.x / scale;
        var y = point.y / scale - offset.y / scale;
        return new DOMPoint(x, y);
        // return point.matrixTransform(this.matrix.inverse());
    };
    /**
     * Apply a new transform to the canvas
     *
     * @param ctx Canvas Rendering Context
     */
    CanvasTransformer.prototype.applyTransform = function (ctx) {
        ctx.setTransform(this.matrix);
    };
    /**
     * Scale the canvas by a factor and origin in the viewport
     *
     * @param delta Scale delta
     * @param origin Origin to scale at
     */
    CanvasTransformer.prototype.scale = function (scale, origin) {
        if (origin === void 0) { origin = new DOMPoint(0, 0); }
        if (Number.isNaN(scale))
            return;
        console.debug("scale", scale, origin);
        var amount = scale * this.info.scale;
        this.options.scale = amount;
        // Make sure the scale is within bounds
        if (amount < this.minScale || amount > this.maxScale) {
            return;
        }
        var point = this.localPoint(origin);
        this.matrix = this.matrix.scale(scale, scale, 0, point.x, point.y, point.z);
        this.notify();
    };
    /**
     * Pan the canvas in a given direction
     *
     * @param delta X and Y coordinates of the vector
     */
    CanvasTransformer.prototype.pan = function (delta) {
        if (Number.isNaN(delta))
            return;
        var scale = this.info.scale;
        console.debug("pan", delta);
        this.options.offset.x += delta.x / scale;
        this.options.offset.y += delta.y / scale;
        this.matrix = this.matrix.translate(delta.x / scale, delta.y / scale, delta.z / scale);
        this.notify();
    };
    Object.defineProperty(CanvasTransformer.prototype, "info", {
        get: function () {
            var _a = decomposeMatrix(this.matrix), scaleX = _a.scaleX, scaleY = _a.scaleY, translateX = _a.translateX, translateY = _a.translateY, rotate = _a.rotate;
            return {
                scale: Math.min(scaleX, scaleY),
                offset: new DOMPoint(translateX, translateY),
                rotation: rotate,
                mouse: this.mouse,
                mouseDown: this.mouseDown,
            };
        },
        enumerable: false,
        configurable: true
    });
    CanvasTransformer.prototype.onWheelEvent = function (e) {
        this.preventDefault(e);
        if (this.gestureEvent)
            return;
        var origin = new DOMPoint(e.offsetX, e.offsetY);
        if (e.ctrlKey) {
            var scale = 1;
            if (e.deltaY < 0) {
                scale = Math.min(this.maxScale, scale * 1.1);
            }
            else {
                scale = Math.max(this.minScale, scale * (1 / 1.1));
            }
            this.scale(scale, origin);
        }
        else {
            this.pan(new DOMPoint(-e.deltaX, -e.deltaY));
        }
        // return false;
    };
    CanvasTransformer.prototype.onMouseDown = function (e) {
        this.mouse = new DOMPoint(e.offsetX, e.offsetY);
        this.mouseDown = true;
    };
    CanvasTransformer.prototype.onMouseMove = function (e) {
        this.mouse = new DOMPoint(e.offsetX, e.offsetY);
    };
    CanvasTransformer.prototype.onMouseUp = function (e) {
        this.mouse = new DOMPoint(e.offsetX, e.offsetY);
        this.mouseDown = false;
    };
    CanvasTransformer.prototype.onTouchStart = function (e) {
        this.preventDefault(e);
        this.touches = e.touches;
        this.mouseDown = true;
        this.gestureEvent = this.touches.length > 1;
    };
    CanvasTransformer.prototype.onTouchMove = function (e) {
        this.preventDefault(e);
        var prev = this.touches;
        this.touches = e.touches;
        if (this.gestureEvent) {
            var oldPoint1 = new DOMPoint(prev[0].clientX, prev[0].clientY);
            var oldPoint2 = new DOMPoint(prev[1].clientX, prev[1].clientY);
            var newPoint1 = new DOMPoint(this.touches[0].clientX, this.touches[0].clientY);
            var newPoint2 = new DOMPoint(this.touches[1].clientX, this.touches[1].clientY);
            if (this.touches.length === 2) {
                // Get the center of the two touches
                var oldCenter = new DOMPoint((oldPoint1.x + oldPoint2.x) / 2, (oldPoint1.y + oldPoint2.y) / 2);
                var newCenter = new DOMPoint((newPoint1.x + newPoint2.x) / 2, (newPoint1.y + newPoint2.y) / 2);
                // Get the distance between the two touches
                var oldDistance = oldPoint1.x - oldPoint2.x;
                var newDistance = newPoint1.x - newPoint2.x;
                // Get the scale factor
                var scale = newDistance / oldDistance;
                // Scale at the center of the two touches
                this.scale(scale, newCenter);
                // Pan the difference between the two touches
                if (newCenter !== oldCenter) {
                    var oldMin = new DOMPoint(Math.min(oldPoint1.x, oldPoint2.x), Math.min(oldPoint1.y, oldPoint2.y));
                    var newMin = new DOMPoint(Math.min(newPoint1.x, newPoint2.x), Math.min(newPoint1.y, newPoint2.y));
                    var delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
                    this.pan(delta);
                }
            }
            else if (this.touches.length === 3) {
                var oldPoint3 = new DOMPoint(prev[2].clientX, prev[2].clientY);
                var newPoint3 = new DOMPoint(this.touches[2].clientX, this.touches[2].clientY);
                // Pan the canvas
                var oldMin = new DOMPoint(Math.min(oldPoint1.x, oldPoint2.x, oldPoint3.x), Math.min(oldPoint1.y, oldPoint2.y, oldPoint3.y));
                var newMin = new DOMPoint(Math.min(newPoint1.x, newPoint2.x, oldPoint3.x), Math.min(newPoint1.y, newPoint2.y, newPoint3.y));
                var delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
                this.pan(delta);
            }
        }
    };
    CanvasTransformer.prototype.onTouchEnd = function (e) {
        this.preventDefault(e);
        this.touches = e.touches;
        this.mouseDown = this.touches.length === 0;
        this.gestureEvent = this.touches.length > 1;
    };
    CanvasTransformer.prototype.onKeyDownEvent = function (e) {
        if (e.key === "ArrowLeft") {
            this.pan(new DOMPoint(-10, 0));
        }
        else if (e.key === "ArrowRight") {
            this.pan(new DOMPoint(10, 0));
        }
        else if (e.key === "ArrowUp") {
            this.pan(new DOMPoint(0, -10));
        }
        else if (e.key === "ArrowDown") {
            this.pan(new DOMPoint(0, 10));
        }
        else if (e.key === "=") {
            this.scale(1.1, this.mouse);
        }
        else if (e.key === "-") {
            this.scale(1 / 1.1, this.mouse);
        }
    };
    CanvasTransformer.prototype.onKeyUpEvent = function (e) { };
    CanvasTransformer.prototype.preventDefault = function (e) {
        e.preventDefault();
    };
    return CanvasTransformer;
}(listenable_1.Listenable));
exports.CanvasTransformer = CanvasTransformer;
// https://gist.github.com/fwextensions/2052247
function decomposeMatrix(m) {
    var E = (m.a + m.d) / 2;
    var F = (m.a - m.d) / 2;
    var G = (m.c + m.b) / 2;
    var H = (m.c - m.b) / 2;
    var Q = Math.sqrt(E * E + H * H);
    var R = Math.sqrt(F * F + G * G);
    var a1 = Math.atan2(G, F);
    var a2 = Math.atan2(H, E);
    var theta = (a2 - a1) / 2;
    var phi = (a2 + a1) / 2;
    return {
        translateX: m.e,
        translateY: m.f,
        rotate: (-phi * 180) / Math.PI,
        scaleX: Q + R,
        scaleY: Q - R,
        skew: (-theta * 180) / Math.PI,
    };
}
//# sourceMappingURL=transformer.js.map