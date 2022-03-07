import { CanvasWidget } from "./classes";
import { drawInfiniteGrid } from "./infinite-grid";
import {
  CanvasTransformer,
  CanvasTransformerOptions,
  defaultOptions,
} from "./transformer";
import { color, Offset, outerRect, Size } from "./utils";

export interface CanvasControllerOptions extends CanvasTransformerOptions {
  drawBackground?: (
    ctx: CanvasRenderingContext2D,
    offset: Offset,
    scale: number
  ) => void;
  drawOutline?: (
    ctx: CanvasRenderingContext2D,
    size: Size,
    strokeColor: string
  ) => void;
  devicePixelRatio: number;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
}

const defaultControllerOptions: CanvasControllerOptions = {
  ...defaultOptions,
  devicePixelRatio: window.devicePixelRatio || 1,
  imageSmoothingEnabled: true,
  imageSmoothingQuality: "high",
};

export class CanvasController<
  T extends CanvasWidget = CanvasWidget
> extends CanvasTransformer<T> {
  constructor(
    readonly canvas: HTMLCanvasElement = document.createElement("canvas"),
    readonly options: CanvasControllerOptions = defaultControllerOptions
  ) {
    super(canvas, options);
  }

  children: T[] = [];
  selection: T[] = [];
  hovered: T[] = [];
  canSelect = true;
  canMove = true;
  canDelete = true;
  drawGrid = true;
  selectIndex = 0;
  isMoving = false;
  dblClickTimeout?: number;

  drawBackground() {
    const { offset, scale } = this.info;
    const { ctx, canvas } = this;

    if (this.options.drawBackground !== undefined) {
      ctx.save();
      this.options.drawBackground(ctx, offset, scale);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.fillStyle = color(canvas, "--canvas-background-color");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.drawGrid) {
      drawInfiniteGrid(canvas, ctx, {
        offset,
        scale,
        backgroundColor: "--canvas-background-color",
        gridColor: "--canvas-grid-color",
      });
    }
    ctx.restore();
  }

  resize() {
    const elem = this.canvas;
    const style = getComputedStyle(elem);
    const { canvas, ctx } = this;
    const width = parseInt(style.width, 10);
    const height = parseInt(style.height, 10);
    canvas.width = width;
    canvas.height = height;
  }

  canvasResize() {
    const { canvas, ctx } = this;
    const rect = canvas.getBoundingClientRect();
    const dpr = this.options.devicePixelRatio;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
  }

  paint() {
    const { canvas, ctx } = this;
    this.resize();

    // Set canvas options
    ctx.imageSmoothingEnabled = this.options.imageSmoothingEnabled;
    ctx.imageSmoothingQuality = this.options.imageSmoothingQuality;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    this.drawBackground();

    // Apply Transform
    this.applyTransform(ctx);

    // Draw content
    this.drawContent(ctx);

    // Apply Transform
    this.applyTransform(ctx);

    // Draw selection
    if (this.selection.length > 1) {
      const rect = outerRect(this.selection.map((item) => item.rect));
      ctx.save();
      ctx.translate(rect.x, rect.y);
      this.drawOutline(ctx, rect, "--canvas-selected-color");
      ctx.restore();
    }

    requestAnimationFrame(() => this.paint());
  }

  drawContent(ctx: CanvasRenderingContext2D) {
    for (const child of this.children) {
      this.drawChild(ctx, child);
    }
  }

  drawChild(ctx: CanvasRenderingContext2D, child: T, parent?: DOMRect) {
    const rect = child.rect;
    ctx.save();
    ctx.translate(rect.x, rect.y);
    child.draw(this.ctx, {
      width: rect.width,
      height: rect.height,
    });
    child.drawDecoration(ctx, this.selection, this.hovered);
    ctx.translate(-rect.x, -rect.y);
    ctx.restore();
  }

  drawOutline(ctx: CanvasRenderingContext2D, size: Size, strokeColor: string) {
    const { canvas } = this;
    if (this.options.drawOutline !== undefined) {
      ctx.save();
      this.options.drawOutline(ctx, size, strokeColor);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.strokeStyle = color(canvas, strokeColor);
    ctx.strokeRect(0, 0, size.width, size.height);
    ctx.restore();
  }

  getSelectionAt(
    point: DOMPoint,
    options: {
      max: number;
      level: number;
    }
  ) {
    const localPoint = this.localPoint(point);
    const selection: T[] = [];
    let level = this.selectIndex + 1;
    while (selection.length === 0 && level > -1) {
      level--;
      for (const child of Array.from(this.children).reverse()) {
        const hit = child.selectAt(localPoint, level);
        if (hit) {
          selection.push(hit as T);
        }
      }
    }
    return selection.slice(0, options.max);
  }

  override onMouseDown(e: MouseEvent): void {
    super.onMouseDown(e);
    this.middleClick = e.button === 1;
    if (this.canSelect) {
      if (this.selection.length > 0) {
        const point = this.localPoint(this.mouse);
        const outer = outerRect(this.selection.map((item) => item.rect));
        if (
          point.x >= outer.x &&
          point.x <= outer.x + outer.width &&
          point.y >= outer.y &&
          point.y <= outer.y + outer.height
        ) {
          return;
        }
      }
      const selection = this.getSelectionAt(this.mouse, {
        max: 1,
        level: this.selectIndex,
      });
      this.updateSelection(selection);
    }
    this.updateCursor();
  }

  override onMouseUp(e: MouseEvent): void {
    super.onMouseUp(e);
    if (this.canSelect && !this.isMoving) {
      // Check for dbclick delay
      if (this.dblClickTimeout !== undefined) {
        clearTimeout(this.dblClickTimeout);
        this.dblClickTimeout = undefined;
        // Double click
        this.selectIndex += 1;
        const point = new DOMPoint(e.clientX, e.clientY);
        this.mouse = point;
        this.selectAt(point);
      } else {
        this.dblClickTimeout = window.setTimeout(() => {
          this.dblClickTimeout = undefined;
          // Single click
          this.selectIndex = 0;
          const point = new DOMPoint(e.clientX, e.clientY);
          this.mouse = point;
          this.selectAt(point);
        }, 200);
      }
    }
    this.isMoving = false;
    this.middleClick = false;
    this.updateCursor();
  }

  override onMouseMove(e: MouseEvent): void {
    const currentMouse = this.mouse;
    super.onMouseMove(e);
    this.hovered = this.getSelectionAt(this.mouse, {
      max: 1,
      level: 0,
    });
    if (this.mouseDown) {
      this.isMoving = true;
      this.move(
        new DOMPoint(
          this.mouse.x - currentMouse.x,
          this.mouse.y - currentMouse.y
        )
      );
    }
    this.updateCursor();
  }

  override onTouchStart(e: TouchEvent): void {
    super.onTouchStart(e);

    if (!this.gestureEvent && this.canSelect) {
      const touch = e.touches[0];
      const point = new DOMPoint(touch.clientX, touch.clientY);
      this.selectIndex = 0;
      this.selectAt(point);
    }
  }

  override onTouchMove(e: TouchEvent): void {
    const currentTouch = (this.touches || [])[0];
    super.onTouchMove(e);

    if (!this.gestureEvent) {
      const touch = e.touches[0];
      const scale = this.info.scale;
      const delta = new DOMPoint(
        touch.clientX - currentTouch.clientX,
        touch.clientY - currentTouch.clientY
      );
      this.move(delta);
    }
  }

  move(delta: DOMPoint) {
    if (this.spacePressed || this.middleClick) {
      this.pan(new DOMPoint(delta.x, delta.y));
    } else if (this.canMove && this.selection.length > 0) {
      const scale = this.info.scale;
      for (const widget of this.selection) {
        widget.rect.x += delta.x / scale;
        widget.rect.y += delta.y / scale;
      }
      this.notify();
    }
  }

  override onKeyDownEvent(e: KeyboardEvent) {
    super.onKeyDownEvent(e);
    if (e.key === "Backspace") {
      this.removeSelection();
    }
    if (e.metaKey && e.key === "a") {
      this.updateSelection(this.children);
    }
    this.updateCursor();
  }

  override onKeyUpEvent(e: KeyboardEvent): void {
    super.onKeyUpEvent(e);
    this.updateCursor();
  }

  updateCursor() {
    const { hovered, selection, spacePressed, canMove } = this;
    const sameSelection =
      selection.length > 0 &&
      selection.every((widget) => hovered.includes(widget));
    if (spacePressed || this.middleClick) {
      this.canvas.style.cursor = "grab";
    } else if (selection.length > 0 && sameSelection && canMove) {
      this.canvas.style.cursor = "move";
    } else {
      this.canvas.style.cursor = "default";
    }
  }

  selectAt(point: DOMPoint) {
    const selection = this.getSelectionAt(point, {
      max: 1,
      level: this.selectIndex,
    });
    this.updateSelection(selection);
  }

  updateSelection(selection: T[]) {
    if (this.shiftPressed) {
      this.selection = this.selection.concat(selection);
      // Remove duplicates
      this.selection = this.selection.filter(
        (w, i) => this.selection.indexOf(w) === i
      );
    } else {
      this.selection = selection;
    }
    this.updateCursor();
    this.notify();
  }

  clearSelection() {
    this.updateSelection([]);
  }

  removeSelection() {
    if (!this.canDelete) return;
    this.children = this.children.filter((w) => !this.selection.includes(w));
    this.clearSelection();
  }

  addChild(widget: T) {
    this.children.push(widget);
    this.updateSelection([widget]);
  }
}

function childRect(main: DOMRect, parent?: DOMRect) {
  if (!parent) return main;
  return new DOMRect(
    parent.x + main.x,
    parent.y + main.y,
    main.width,
    main.height
  );
}

function getRects(child: CanvasWidget, parent?: DOMRect) {
  const rects: DOMRect[] = [];
  const rect = childRect(child.rect, parent);
  rects.push(rect);
  // if (child instanceof GroupBase) {
  //   const children = child.children as CanvasWidget[];
  //   for (const item of children) {
  //     rects.push(...getRects(item, rect));
  //   }
  // }
  return rects;
}
