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
import { drawInfiniteGrid } from "./infinite-grid";
import { CanvasTransformer, defaultOptions, } from "./transformer";
import { color } from "./utils";
var CanvasController = /** @class */ (function (_super) {
    __extends(CanvasController, _super);
    function CanvasController(canvas, options) {
        if (options === void 0) { options = defaultOptions; }
        var _this = _super.call(this, canvas, options) || this;
        _this.canvas = canvas;
        _this.options = options;
        _this.children = [];
        _this.selection = [];
        _this.hovered = [];
        _this.canSelect = true;
        _this.canMove = true;
        _this.canDelete = true;
        _this.spacePressed = false;
        _this.middleClick = false;
        return _this;
    }
    CanvasController.prototype.drawBackground = function () {
        var _a = this.info, offset = _a.offset, scale = _a.scale;
        var _b = this, ctx = _b.ctx, canvas = _b.canvas;
        ctx.fillStyle = color(canvas, "--canvas-controller-background-color");
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawInfiniteGrid(canvas, ctx, {
            offset: offset,
            scale: scale,
            backgroundColor: "--canvas-controller-background-color",
            gridColor: "--canvas-controller-grid-color",
        });
    };
    CanvasController.prototype.resize = function () {
        var elem = this.canvas;
        var style = getComputedStyle(elem);
        var canvas = this.canvas;
        canvas.width = parseInt(style.width, 10);
        canvas.height = parseInt(style.height, 10);
    };
    CanvasController.prototype.paint = function () {
        var _this = this;
        var _a = this, canvas = _a.canvas, ctx = _a.ctx;
        this.resize();
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw background
        this.drawBackground();
        // Apply Transform
        this.applyTransform(ctx);
        // Draw content
        this.drawContent(ctx);
        requestAnimationFrame(function () { return _this.paint(); });
    };
    CanvasController.prototype.drawContent = function (ctx) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            ctx.save();
            ctx.translate(child.rect.x, child.rect.y);
            child.draw(this.ctx);
            ctx.restore();
            if (this.selection.includes(child)) {
                this.drawOutline(ctx, child.rect, "--canvas-controller-selected-color");
            }
            else if (this.hovered.includes(child)) {
                this.drawOutline(ctx, child.rect, "--canvas-controller-hovered-color");
            }
        }
    };
    CanvasController.prototype.drawOutline = function (ctx, rect, strokeColor) {
        var canvas = this.canvas;
        ctx.save();
        ctx.strokeStyle = color(canvas, strokeColor);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.restore();
    };
    CanvasController.prototype.select = function (point, max) {
        if (max === void 0) { max = 1; }
        var localPoint = this.localPoint(point);
        var selection = [];
        var children = Array.from(this.children).reverse();
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            var rect = child.rect;
            if (localPoint.x >= rect.x &&
                localPoint.x <= rect.x + rect.width &&
                localPoint.y >= rect.y &&
                localPoint.y <= rect.y + rect.height) {
                selection.push(child);
                continue;
            }
        }
        return selection.slice(0, max);
    };
    CanvasController.prototype.onMouseDown = function (e) {
        _super.prototype.onMouseDown.call(this, e);
        if (this.canSelect) {
            this.updateSelection(this.select(this.mouse));
        }
        this.middleClick = e.button === 1;
        this.updateCursor();
    };
    CanvasController.prototype.onMouseUp = function (e) {
        _super.prototype.onMouseUp.call(this, e);
        if (this.canSelect) {
            this.updateSelection(this.select(this.mouse));
        }
        this.middleClick = false;
        this.updateCursor();
    };
    CanvasController.prototype.onMouseMove = function (e) {
        var currentMouse = this.mouse;
        _super.prototype.onMouseMove.call(this, e);
        this.hovered = this.select(this.mouse);
        if (this.mouseDown) {
            this.move(new DOMPoint(this.mouse.x - currentMouse.x, this.mouse.y - currentMouse.y));
        }
        this.updateCursor();
    };
    CanvasController.prototype.onTouchStart = function (e) {
        _super.prototype.onTouchStart.call(this, e);
        if (!this.gestureEvent && this.canSelect) {
            var touch = e.touches[0];
            var point = new DOMPoint(touch.clientX, touch.clientY);
            this.updateSelection(this.select(point));
        }
    };
    CanvasController.prototype.onTouchMove = function (e) {
        var currentTouch = (this.touches || [])[0];
        _super.prototype.onTouchMove.call(this, e);
        if (!this.gestureEvent) {
            var touch = e.touches[0];
            this.move(new DOMPoint(touch.clientX - currentTouch.clientX, touch.clientY - currentTouch.clientY));
        }
    };
    CanvasController.prototype.move = function (delta) {
        if (this.spacePressed || this.middleClick) {
            this.pan(new DOMPoint(delta.x, delta.y));
        }
        else if (this.canMove && this.selection.length > 0) {
            var scale = this.info.scale;
            for (var _i = 0, _a = this.selection; _i < _a.length; _i++) {
                var widget = _a[_i];
                var rect = widget.rect;
                rect.x += delta.x / scale;
                rect.y += delta.y / scale;
                widget.rect = rect;
                this.notify();
            }
        }
    };
    CanvasController.prototype.onKeyDownEvent = function (e) {
        _super.prototype.onKeyDownEvent.call(this, e);
        if (e.key === "Backspace") {
            this.removeSelection();
        }
        this.spacePressed = e.key === " ";
        this.updateCursor();
    };
    CanvasController.prototype.onKeyUpEvent = function (e) {
        _super.prototype.onKeyUpEvent.call(this, e);
        this.spacePressed = false;
        this.updateCursor();
    };
    CanvasController.prototype.updateCursor = function () {
        var _a = this, hovered = _a.hovered, selection = _a.selection, spacePressed = _a.spacePressed, canMove = _a.canMove;
        var sameSelection = selection.length > 0 &&
            selection.every(function (widget) { return hovered.includes(widget); });
        if (spacePressed || this.middleClick) {
            this.canvas.style.cursor = "grab";
        }
        else if (selection.length > 0 && sameSelection && canMove) {
            this.canvas.style.cursor = "move";
        }
        else {
            this.canvas.style.cursor = "default";
        }
    };
    CanvasController.prototype.updateSelection = function (selection) {
        this.selection = selection;
        this.notify();
    };
    CanvasController.prototype.clearSelection = function () {
        this.updateSelection([]);
    };
    CanvasController.prototype.removeSelection = function () {
        var _this = this;
        if (!this.canDelete)
            return;
        this.children = this.children.filter(function (w) { return !_this.selection.includes(w); });
        this.clearSelection();
    };
    CanvasController.prototype.addChild = function (widget) {
        this.children.push(widget);
        this.updateSelection([widget]);
    };
    return CanvasController;
}(CanvasTransformer));
export { CanvasController };
//# sourceMappingURL=controller.js.map