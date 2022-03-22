import { CanvasEvent, ClickEvent, FrameUpdate, HoverEvent } from "../events.js";
import { Listenable } from "../listenable.js";
import { CanvasInfo } from "../transformer.js";
import { drawOutline, Offset, Rect, Size } from "../utils.js";

export abstract class CanvasWidget extends Listenable<CanvasEvent> {
  abstract draw(context: CanvasContext, parent?: Size): void;

  selectAt(point: DOMPoint, level: number): CanvasWidget | null {
    const rect = this.rect;
    if (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    ) {
      if (level === 0) return this;
    }
    return null;
  }

  hidden = false;

  drawDecoration(
    context: CanvasContext,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ) {
    const rect = this.rect;
    const ctx = {
      ...context,
      size: rect,
    };
    if (selection.length > 0 && selection.includes(this)) {
      drawOutline(ctx, "--canvas-selected-color");
    } else if (hovered.length > 0 && hovered.includes(this)) {
      drawOutline(ctx, "--canvas-hovered-color");
    }
  }

  move(delta: Offset) {
    this.rect.x += delta.x;
    this.rect.y += delta.y;
  }

  resize(size: Size) {
    this.rect.width = size.width;
    this.rect.height = size.height;
  }

  get size(): Size {
    return {
      width: this.rect.width,
      height: this.rect.height,
    };
  }

  get offset(): Offset {
    return {
      x: this.rect.x,
      y: this.rect.y,
    };
  }

  abstract get rect(): Rect;

  onClick(point: DOMPoint) {
    const event: ClickEvent = {
      type: "click",
      offset: { x: point.x, y: point.y },
    };
    this.notifyListeners(event);
  }

  onHover(point: DOMPoint) {
    const event: HoverEvent = {
      type: "hover",
      offset: { x: point.x, y: point.y },
    };
    this.notifyListeners(event);
  }

  onUpdate(time: number) {
    const event: FrameUpdate = {
      type: "update",
      time,
    };
    this.notifyListeners(event);
  }
}

export interface CanvasContext extends CanvasInfo {
  ctx: CanvasRenderingContext2D;
  size: Size;
  resolveValue: (value: string) => string;
}
