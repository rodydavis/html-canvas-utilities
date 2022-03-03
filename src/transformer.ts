import { Listenable } from "./listenable";

export interface CanvasTransformerOptions {
  scale: number;
  offset: DOMPoint;
}

export const defaultOptions: CanvasTransformerOptions = {
  scale: 1,
  offset: new DOMPoint(0, 0),
};

export class CanvasTransformer<T> extends Listenable<T> {
  constructor(
    readonly canvas: HTMLCanvasElement,
    readonly options: CanvasTransformerOptions = defaultOptions
  ) {
    super();
    this.ctx = this.canvas.getContext("2d")!;
    this.transform = this.ctx.getTransform();

    this.shouldNotify = false;
    const { scale, offset } = options;
    this.scale(scale);
    this.pan(offset);
    this.shouldNotify = true;

    // Scroll events
    this.onWheelEvent = this.onWheelEvent.bind(this);
    canvas.addEventListener("wheel", this.onWheelEvent, { passive: false });

    // Mouse Events
    this.onMouseDown = this.onMouseDown.bind(this);
    canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.onMouseMove = this.onMouseMove.bind(this);
    canvas.addEventListener("mousemove", this.onMouseMove, false);
    this.onMouseUp = this.onMouseUp.bind(this);
    canvas.addEventListener("mouseup", this.onMouseUp, false);

    // Touch Events
    this.onTouchStart = this.onTouchStart.bind(this);
    canvas.addEventListener("touchstart", this.onTouchStart, false);
    this.onTouchMove = this.onTouchMove.bind(this);
    canvas.addEventListener("touchmove", this.onTouchMove, false);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    canvas.addEventListener("touchend", this.onTouchEnd, false);

    // TODO: Prevent Safari iPadOS pinch / zoom
    // canvas.addEventListener("gesturestart", this.preventDefault, false);
    // canvas.addEventListener("gesturechange", this.preventDefault, false);
    // canvas.addEventListener("gestureend", this.preventDefault, false);
    // window.addEventListener("scroll", this.preventDefault, { passive: false });

    // Keyboard Events
    this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    document.addEventListener("keydown", this.onKeyDownEvent, false);
    document.addEventListener("keyup", this.onKeyUpEvent, false);
  }

  gestureEvent = false;
  touches?: TouchList;
  mouse = new DOMPoint(0, 0);
  mouseDown = false;
  spacePressed = false;
  controlPressed = false;
  shiftPressed = false;
  middleClick = false;

  private transform: DOMMatrix;
  get matrix() {
    return this.transform;
  }
  set matrix(matrix: DOMMatrix) {
    this.transform = matrix;
    this.notify();
  }

  shouldNotify = true;
  notify() {
    if (!this.shouldNotify) return;
    this.notifyListeners();
  }

  /** Canvas Context */
  readonly ctx: CanvasRenderingContext2D;
  minScale = 0.1;
  maxScale = 10;

  /**
   * Transforms the mouse coordinates to the local coordinates of the canvas
   *
   * @param point X and Y coordinates of the vector
   */
  localPoint(point: DOMPoint) {
    const { scale, offset } = this.info;
    const x = point.x / scale - offset.x / scale;
    const y = point.y / scale - offset.y / scale;
    return new DOMPoint(x, y);
    // return point.matrixTransform(this.matrix.inverse());
  }

  /**
   * Apply a new transform to the canvas
   *
   * @param ctx Canvas Rendering Context
   */
  applyTransform(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(this.matrix);
  }

  /**
   * Scale the canvas by a factor and origin in the viewport
   *
   * @param delta Scale delta
   * @param origin Origin to scale at
   */
  scale(scale: number, origin: DOMPoint = new DOMPoint(0, 0)) {
    if (Number.isNaN(scale)) return;
    const amount = scale * this.info.scale;
    this.options.scale = amount;
    // Make sure the scale is within bounds
    if (amount < this.minScale || amount > this.maxScale) {
      return;
    }
    const point = this.localPoint(origin);
    this.matrix = this.matrix.scale(scale, scale, 0, point.x, point.y, point.z);
    this.notify();
  }

  /**
   * Pan the canvas in a given direction
   *
   * @param delta X and Y coordinates of the vector
   */
  pan(delta: DOMPoint) {
    if (Number.isNaN(delta)) return;
    const { scale } = this.info;
    this.options.offset.x += delta.x / scale;
    this.options.offset.y += delta.y / scale;
    this.matrix = this.matrix.translate(
      delta.x / scale,
      delta.y / scale,
      delta.z / scale
    );
    this.notify();
  }

  get info() {
    const { scaleX, scaleY, translateX, translateY, rotate } = decomposeMatrix(
      this.matrix
    );
    return {
      scale: Math.min(scaleX, scaleY),
      offset: new DOMPoint(translateX, translateY),
      rotation: rotate,
      mouse: this.mouse,
      mouseDown: this.mouseDown,
    };
  }

  private onWheelEvent(e: WheelEvent) {
    this.preventDefault(e);
    if (this.gestureEvent) return;
    const origin = new DOMPoint(e.offsetX, e.offsetY);
    if (e.ctrlKey || this.controlPressed) {
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
    // return false;
  }

  onMouseDown(e: MouseEvent) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
    this.mouseDown = true;
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
  }

  onMouseUp(e: MouseEvent) {
    this.mouse = new DOMPoint(e.offsetX, e.offsetY);
    this.mouseDown = false;
  }

  onTouchStart(e: TouchEvent) {
    this.preventDefault(e);

    this.touches = e.touches;
    this.mouseDown = true;
    this.gestureEvent = this.touches.length > 1;
  }

  onTouchMove(e: TouchEvent) {
    this.preventDefault(e);

    const prev = this.touches!;
    this.touches = e.touches;

    if (this.gestureEvent) {
      const oldPoint1 = new DOMPoint(prev[0].clientX, prev[0].clientY);
      const oldPoint2 = new DOMPoint(prev[1].clientX, prev[1].clientY);
      const newPoint1 = new DOMPoint(
        this.touches[0].clientX,
        this.touches[0].clientY
      );
      const newPoint2 = new DOMPoint(
        this.touches[1].clientX,
        this.touches[1].clientY
      );
      if (this.touches.length === 2) {
        // Get the center of the two touches
        const oldCenter = new DOMPoint(
          (oldPoint1.x + oldPoint2.x) / 2,
          (oldPoint1.y + oldPoint2.y) / 2
        );
        const newCenter = new DOMPoint(
          (newPoint1.x + newPoint2.x) / 2,
          (newPoint1.y + newPoint2.y) / 2
        );

        // Get the distance between the two touches
        const oldDistance = oldPoint1.x - oldPoint2.x;
        const newDistance = newPoint1.x - newPoint2.x;

        // Get the scale factor
        const scale = newDistance / oldDistance;

        // Scale at the center of the two touches
        this.scale(scale, newCenter);

        // Pan the difference between the two touches
        if (newCenter !== oldCenter) {
          const oldMin = new DOMPoint(
            Math.min(oldPoint1.x, oldPoint2.x),
            Math.min(oldPoint1.y, oldPoint2.y)
          );
          const newMin = new DOMPoint(
            Math.min(newPoint1.x, newPoint2.x),
            Math.min(newPoint1.y, newPoint2.y)
          );
          const delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
          this.pan(delta);
        }
      } else if (this.touches.length === 3) {
        const oldPoint3 = new DOMPoint(prev[2].clientX, prev[2].clientY);
        const newPoint3 = new DOMPoint(
          this.touches[2].clientX,
          this.touches[2].clientY
        );

        // Pan the canvas
        const oldMin = new DOMPoint(
          Math.min(oldPoint1.x, oldPoint2.x, oldPoint3.x),
          Math.min(oldPoint1.y, oldPoint2.y, oldPoint3.y)
        );
        const newMin = new DOMPoint(
          Math.min(newPoint1.x, newPoint2.x, oldPoint3.x),
          Math.min(newPoint1.y, newPoint2.y, newPoint3.y)
        );
        const delta = new DOMPoint(newMin.x - oldMin.x, newMin.y - oldMin.y);
        this.pan(delta);
      }
    }
  }

  onTouchEnd(e: TouchEvent) {
    this.preventDefault(e);

    this.touches = e.touches;
    this.mouseDown = this.touches.length === 0;
    this.gestureEvent = this.touches.length > 1;
  }

  onKeyDownEvent(e: KeyboardEvent) {
    this.preventDefault(e);
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
    this.controlPressed = e.ctrlKey;
    this.shiftPressed = e.shiftKey;
    this.spacePressed = e.key === " ";
  }

  onKeyUpEvent(e: KeyboardEvent) {
    this.preventDefault(e);
    this.controlPressed = false;
    this.spacePressed = false;
    this.shiftPressed = false;
  }

  preventDefault(e: Event) {
    e.preventDefault();
  }
}

// https://gist.github.com/fwextensions/2052247
function decomposeMatrix(m: DOMMatrix) {
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
    rotate: (-phi * 180) / Math.PI,
    scaleX: Q + R,
    scaleY: Q - R,
    skew: (-theta * 180) / Math.PI,
  };
}
