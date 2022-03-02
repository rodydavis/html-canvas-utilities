import { drawInfiniteGrid } from "./infinite-grid";
import {
  CanvasTransformer,
  CanvasTransformerOptions,
  defaultOptions,
} from "./transformer";
import { color } from "./utils";

export class CanvasController<
  T extends CanvasWidget = CanvasWidget
> extends CanvasTransformer<T> {
  constructor(
    readonly canvas: HTMLCanvasElement,
    readonly options: CanvasTransformerOptions = defaultOptions
  ) {
    super(canvas, options);
  }

  children: T[] = [];
  selection: T[] = [];
  hovered: T[] = [];
  canSelect = true;
  canMove = true;
  canDelete = true;

  drawBackground() {
    const { offset, scale } = this.info;
    const { ctx, canvas } = this;

    ctx.fillStyle = color(canvas, "--canvas-controller-background-color");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawInfiniteGrid(canvas, ctx, {
      offset,
      scale,
      backgroundColor: "--canvas-controller-background-color",
      gridColor: "--canvas-controller-grid-color",
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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    this.drawBackground();

    // Apply Transform
    this.applyTransform(ctx);

    // Draw content
    this.drawContent(ctx);

    requestAnimationFrame(() => this.paint());
  }

  drawContent(ctx: CanvasRenderingContext2D) {
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

  drawOutline(
    ctx: CanvasRenderingContext2D,
    rect: DOMRect,
    strokeColor: string
  ) {
    const { canvas } = this;
    ctx.save();
    ctx.strokeStyle = color(canvas, strokeColor);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  }

  select(point: DOMPoint, max: number = 1) {
    const localPoint = this.localPoint(point);
    const selection: T[] = [];

    const children = Array.from(this.children).reverse();
    for (const child of children) {
      const rect = child.rect;
      if (
        localPoint.x >= rect.x &&
        localPoint.x <= rect.x + rect.width &&
        localPoint.y >= rect.y &&
        localPoint.y <= rect.y + rect.height
      ) {
        selection.push(child);
        continue;
      }
    }
    return selection.slice(0, max);
  }

  override onMouseDown(e: MouseEvent): void {
    super.onMouseDown(e);

    if (this.canSelect) {
      this.updateSelection(this.select(this.mouse));
    }
    this.middleClick = e.button === 1;
    this.updateCursor();
  }

  override onMouseUp(e: MouseEvent): void {
    super.onMouseUp(e);
    if (this.canSelect) {
      this.updateSelection(this.select(this.mouse));
    }
    this.middleClick = false;
    this.updateCursor();
  }

  override onMouseMove(e: MouseEvent): void {
    const currentMouse = this.mouse;
    super.onMouseMove(e);
    this.hovered = this.select(this.mouse);
    if (this.mouseDown) {
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
      this.updateSelection(this.select(point));
    }
  }

  override onTouchMove(e: TouchEvent): void {
    const currentTouch = (this.touches || [])[0];
    super.onTouchMove(e);

    if (!this.gestureEvent) {
      const touch = e.touches[0];
      this.move(
        new DOMPoint(
          touch.clientX - currentTouch.clientX,
          touch.clientY - currentTouch.clientY
        )
      );
    }
  }

  move(delta: DOMPoint) {
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

  override onKeyDownEvent(e: KeyboardEvent) {
    super.onKeyDownEvent(e);
    if (e.key === "Backspace") {
      this.removeSelection();
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

  updateSelection(selection: T[]) {
    this.selection = selection;
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

export interface CanvasWidget {
  rect: DOMRect;
  draw(ctx: CanvasRenderingContext2D): void;
}
