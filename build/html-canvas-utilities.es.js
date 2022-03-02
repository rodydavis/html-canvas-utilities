function color(elem, value) {
  if (value.startsWith("--")) {
    const style = getComputedStyle(elem);
    return style.getPropertyValue(value);
  }
  return value;
}
function drawInfiniteGrid(canvas, ctx, options) {
  const { offset, scale, backgroundColor, gridColor } = options;
  ctx.save();
  const gridSize = 20 * scale;
  const gridOffsetX = Math.round(offset.x) % gridSize;
  const gridOffsetY = Math.round(offset.y) % gridSize;
  ctx.fillStyle = color(canvas, backgroundColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color(canvas, gridColor);
  ctx.lineWidth = 0.23 * scale;
  for (let x = gridOffsetX; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = gridOffsetY; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}
class Listenable {
  constructor() {
    this.listeners = [];
  }
  addListener(listener) {
    this.listeners.push(listener);
  }
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }
}
const defaultOptions = {
  scale: 1,
  offset: new DOMPoint(0, 0)
};
class CanvasTransformer extends Listenable {
  constructor(canvas, options = defaultOptions) {
    super();
    this.canvas = canvas;
    this.options = options;
    this.gestureEvent = false;
    this.mouse = new DOMPoint(0, 0);
    this.mouseDown = false;
    this.shouldNotify = true;
    this.minScale = 0.1;
    this.maxScale = 10;
    this.ctx = this.canvas.getContext("2d");
    this.transform = this.ctx.getTransform();
    this.shouldNotify = false;
    const { scale, offset } = options;
    this.scale(scale);
    this.pan(offset);
    this.shouldNotify = true;
    this.onWheelEvent = this.onWheelEvent.bind(this);
    canvas.addEventListener("wheel", this.onWheelEvent, { passive: false });
    this.onMouseDown = this.onMouseDown.bind(this);
    canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.onMouseMove = this.onMouseMove.bind(this);
    canvas.addEventListener("mousemove", this.onMouseMove, false);
    this.onMouseUp = this.onMouseUp.bind(this);
    canvas.addEventListener("mouseup", this.onMouseUp, false);
    this.onTouchStart = this.onTouchStart.bind(this);
    canvas.addEventListener("touchstart", this.onTouchStart, false);
    this.onTouchMove = this.onTouchMove.bind(this);
    canvas.addEventListener("touchmove", this.onTouchMove, false);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    canvas.addEventListener("touchend", this.onTouchEnd, false);
    this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    document.addEventListener("keydown", this.onKeyDownEvent, false);
    document.addEventListener("keyup", this.onKeyUpEvent, false);
  }
  get matrix() {
    return this.transform;
  }
  set matrix(matrix) {
    this.transform = matrix;
    this.notify();
  }
  notify() {
    if (!this.shouldNotify)
      return;
    this.notifyListeners();
  }
  localPoint(point) {
    const { scale, offset } = this.info;
    const x = point.x / scale - offset.x / scale;
    const y = point.y / scale - offset.y / scale;
    return new DOMPoint(x, y);
  }
  applyTransform(ctx) {
    ctx.setTransform(this.matrix);
  }
  scale(scale, origin = new DOMPoint(0, 0)) {
    if (Number.isNaN(scale))
      return;
    console.debug("scale", scale, origin);
    const amount = scale * this.info.scale;
    this.options.scale = amount;
    if (amount < this.minScale || amount > this.maxScale) {
      return;
    }
    const point = this.localPoint(origin);
    this.matrix = this.matrix.scale(scale, scale, 0, point.x, point.y, point.z);
    this.notify();
  }
  pan(delta) {
    if (Number.isNaN(delta))
      return;
    const { scale } = this.info;
    console.debug("pan", delta);
    this.options.offset.x += delta.x / scale;
    this.options.offset.y += delta.y / scale;
    this.matrix = this.matrix.translate(delta.x / scale, delta.y / scale, delta.z / scale);
    this.notify();
  }
  get info() {
    const { scaleX, scaleY, translateX, translateY, rotate } = decomposeMatrix(this.matrix);
    return {
      scale: Math.min(scaleX, scaleY),
      offset: new DOMPoint(translateX, translateY),
      rotation: rotate,
      mouse: this.mouse,
      mouseDown: this.mouseDown
    };
  }
  onWheelEvent(e) {
    this.preventDefault(e);
    if (this.gestureEvent)
      return;
    const origin = new DOMPoint(e.offsetX, e.offsetY);
    if (e.ctrlKey) {
      let scale = 1;
      if (e.deltaY < 0) {
        scale = Math.min(this.maxScale, scale * 1.1);
      } else {
        scale = Math.max(this.minScale, scale * (1 / 1.1));
      }
      this.scale(scale, origin);
    } else {
      this.pan(new DOMPoint(-e.deltaX, -e.deltaY));
    }
  }
  onMouseDown(e) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
    this.mouseDown = true;
  }
  onMouseMove(e) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
  }
  onMouseUp(e) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
    this.mouseDown = false;
  }
  onTouchStart(e) {
    this.preventDefault(e);
    this.touches = e.touches;
    this.mouseDown = true;
    this.gestureEvent = this.touches.length > 1;
  }
  onTouchMove(e) {
    this.preventDefault(e);
    const prev = this.touches;
    this.touches = e.touches;
    if (this.gestureEvent) {
      const oldPoint1 = new DOMPoint(prev[0].clientX, prev[0].clientY);
      const oldPoint2 = new DOMPoint(prev[1].clientX, prev[1].clientY);
      const newPoint1 = new DOMPoint(this.touches[0].clientX, this.touches[0].clientY);
      const newPoint2 = new DOMPoint(this.touches[1].clientX, this.touches[1].clientY);
      if (this.touches.length === 2) {
        const oldCenter = new DOMPoint((oldPoint1.x + oldPoint2.x) / 2, (oldPoint1.y + oldPoint2.y) / 2);
        const newCenter = new DOMPoint((newPoint1.x + newPoint2.x) / 2, (newPoint1.y + newPoint2.y) / 2);
        const oldDistance = oldPoint1.x - oldPoint2.x;
        const newDistance = newPoint1.x - newPoint2.x;
        const scale = newDistance / oldDistance;
        this.scale(scale, newCenter);
        if (newCenter !== oldCenter) {
          const oldMin = new DOMPoint(Math.min(oldPoint1.x, oldPoint2.x), Math.min(oldPoint1.y, oldPoint2.y));
          const newMin = new DOMPoint(Math.min(newPoint1.x, newPoint2.x), Math.min(newPoint1.y, newPoint2.y));
          const delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
          this.pan(delta);
        }
      } else if (this.touches.length === 3) {
        const oldPoint3 = new DOMPoint(prev[2].clientX, prev[2].clientY);
        const newPoint3 = new DOMPoint(this.touches[2].clientX, this.touches[2].clientY);
        const oldMin = new DOMPoint(Math.min(oldPoint1.x, oldPoint2.x, oldPoint3.x), Math.min(oldPoint1.y, oldPoint2.y, oldPoint3.y));
        const newMin = new DOMPoint(Math.min(newPoint1.x, newPoint2.x, oldPoint3.x), Math.min(newPoint1.y, newPoint2.y, newPoint3.y));
        const delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
        this.pan(delta);
      }
    }
  }
  onTouchEnd(e) {
    this.preventDefault(e);
    this.touches = e.touches;
    this.mouseDown = this.touches.length === 0;
    this.gestureEvent = this.touches.length > 1;
  }
  onKeyDownEvent(e) {
    if (e.key === "ArrowLeft") {
      this.pan(new DOMPoint(-10, 0));
    } else if (e.key === "ArrowRight") {
      this.pan(new DOMPoint(10, 0));
    } else if (e.key === "ArrowUp") {
      this.pan(new DOMPoint(0, -10));
    } else if (e.key === "ArrowDown") {
      this.pan(new DOMPoint(0, 10));
    } else if (e.key === "=") {
      this.scale(1.1, this.mouse);
    } else if (e.key === "-") {
      this.scale(1 / 1.1, this.mouse);
    }
  }
  onKeyUpEvent(e) {
  }
  preventDefault(e) {
    e.preventDefault();
  }
}
function decomposeMatrix(m) {
  const E = (m.a + m.d) / 2;
  const F = (m.a - m.d) / 2;
  const G = (m.c + m.b) / 2;
  const H = (m.c - m.b) / 2;
  const Q = Math.sqrt(E * E + H * H);
  const R = Math.sqrt(F * F + G * G);
  const a1 = Math.atan2(G, F);
  const a2 = Math.atan2(H, E);
  const theta = (a2 - a1) / 2;
  const phi = (a2 + a1) / 2;
  return {
    translateX: m.e,
    translateY: m.f,
    rotate: -phi * 180 / Math.PI,
    scaleX: Q + R,
    scaleY: Q - R,
    skew: -theta * 180 / Math.PI
  };
}
class CanvasController extends CanvasTransformer {
  constructor(canvas, options = defaultOptions) {
    super(canvas, options);
    this.canvas = canvas;
    this.options = options;
    this.children = [];
    this.selection = [];
    this.hovered = [];
    this.canSelect = true;
    this.canMove = true;
    this.canDelete = true;
    this.spacePressed = false;
    this.middleClick = false;
  }
  drawBackground() {
    const { offset, scale } = this.info;
    const { ctx, canvas } = this;
    ctx.fillStyle = color(canvas, "--canvas-controller-background-color");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawInfiniteGrid(canvas, ctx, {
      offset,
      scale,
      backgroundColor: "--canvas-controller-background-color",
      gridColor: "--canvas-controller-grid-color"
    });
  }
  resize() {
    const elem = this.canvas;
    const style = getComputedStyle(elem);
    const { canvas } = this;
    canvas.width = parseInt(style.width, 10);
    canvas.height = parseInt(style.height, 10);
  }
  paint() {
    const { canvas, ctx } = this;
    this.resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBackground();
    this.applyTransform(ctx);
    this.drawContent(ctx);
    requestAnimationFrame(() => this.paint());
  }
  drawContent(ctx) {
    for (const child of this.children) {
      ctx.save();
      ctx.translate(child.rect.x, child.rect.y);
      child.draw(this.ctx);
      ctx.restore();
      if (this.selection.includes(child)) {
        this.drawOutline(ctx, child.rect, "--canvas-controller-selected-color");
      } else if (this.hovered.includes(child)) {
        this.drawOutline(ctx, child.rect, "--canvas-controller-hovered-color");
      }
    }
  }
  drawOutline(ctx, rect, strokeColor) {
    const { canvas } = this;
    ctx.save();
    ctx.strokeStyle = color(canvas, strokeColor);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  }
  select(point, max = 1) {
    const localPoint = this.localPoint(point);
    const selection = [];
    const children = Array.from(this.children).reverse();
    for (const child of children) {
      const rect = child.rect;
      if (localPoint.x >= rect.x && localPoint.x <= rect.x + rect.width && localPoint.y >= rect.y && localPoint.y <= rect.y + rect.height) {
        selection.push(child);
        continue;
      }
    }
    return selection.slice(0, max);
  }
  onMouseDown(e) {
    super.onMouseDown(e);
    if (this.canSelect) {
      this.updateSelection(this.select(this.mouse));
    }
    this.middleClick = e.button === 1;
    this.updateCursor();
  }
  onMouseUp(e) {
    super.onMouseUp(e);
    if (this.canSelect) {
      this.updateSelection(this.select(this.mouse));
    }
    this.middleClick = false;
    this.updateCursor();
  }
  onMouseMove(e) {
    const currentMouse = this.mouse;
    super.onMouseMove(e);
    this.hovered = this.select(this.mouse);
    if (this.mouseDown) {
      this.move(new DOMPoint(this.mouse.x - currentMouse.x, this.mouse.y - currentMouse.y));
    }
    this.updateCursor();
  }
  onTouchStart(e) {
    super.onTouchStart(e);
    if (!this.gestureEvent && this.canSelect) {
      const touch = e.touches[0];
      const point = new DOMPoint(touch.clientX, touch.clientY);
      this.updateSelection(this.select(point));
    }
  }
  onTouchMove(e) {
    const currentTouch = (this.touches || [])[0];
    super.onTouchMove(e);
    if (!this.gestureEvent) {
      const touch = e.touches[0];
      this.move(new DOMPoint(touch.clientX - currentTouch.clientX, touch.clientY - currentTouch.clientY));
    }
  }
  move(delta) {
    if (this.spacePressed || this.middleClick) {
      this.pan(new DOMPoint(delta.x, delta.y));
    } else if (this.canMove && this.selection.length > 0) {
      const scale = this.info.scale;
      for (const widget of this.selection) {
        const rect = widget.rect;
        rect.x += delta.x / scale;
        rect.y += delta.y / scale;
        widget.rect = rect;
        this.notify();
      }
    }
  }
  onKeyDownEvent(e) {
    super.onKeyDownEvent(e);
    if (e.key === "Backspace") {
      this.removeSelection();
    }
    this.spacePressed = e.key === " ";
    this.updateCursor();
  }
  onKeyUpEvent(e) {
    super.onKeyUpEvent(e);
    this.spacePressed = false;
    this.updateCursor();
  }
  updateCursor() {
    const { hovered, selection, spacePressed, canMove } = this;
    const sameSelection = selection.length > 0 && selection.every((widget) => hovered.includes(widget));
    if (spacePressed || this.middleClick) {
      this.canvas.style.cursor = "grab";
    } else if (selection.length > 0 && sameSelection && canMove) {
      this.canvas.style.cursor = "move";
    } else {
      this.canvas.style.cursor = "default";
    }
  }
  updateSelection(selection) {
    this.selection = selection;
    this.notify();
  }
  clearSelection() {
    this.updateSelection([]);
  }
  removeSelection() {
    if (!this.canDelete)
      return;
    this.children = this.children.filter((w) => !this.selection.includes(w));
    this.clearSelection();
  }
  addChild(widget) {
    this.children.push(widget);
    this.updateSelection([widget]);
  }
}
export { CanvasController, CanvasTransformer, Listenable, color, defaultOptions, drawInfiniteGrid };
