import { drawOutline, Size } from "../utils.js";
import { RectShape } from "./shapes/index.js";
import { CanvasWidget } from "./widget.js";

export type EdgeInsets = number | [number, number, number, number];

export class BoxBase extends RectShape {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      padding?: EdgeInsets;
      margin?: EdgeInsets;
      child: CanvasWidget;
    }
  ) {
    super(options);
  }

  child = this.options.child;
  padding = this.options.padding;
  margin = this.options.margin;

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    let childSize = { ...size };
    if (this.margin) {
      if (Array.isArray(this.margin)) {
        const [top, left, bottom, right] = this.margin;
        ctx.translate(left, top);
        childSize.width -= left + right;
        childSize.height -= top + bottom;
      } else {
        const all = this.margin;
        ctx.translate(all, all);
        childSize.width -= all * 2;
        childSize.height -= all * 2;
      }
    }
    super.draw(ctx, childSize);
    if (this.padding) {
      if (Array.isArray(this.padding)) {
        const [top, left, bottom, right] = this.padding;
        ctx.translate(left, top);
        childSize.width -= left + right;
        childSize.height -= top + bottom;
      } else {
        const all = this.padding;
        ctx.translate(all, all);
        childSize.width -= all * 2;
        childSize.height -= all * 2;
      }
    }
    this.child.draw(ctx, childSize, this.rect);
  }

  override drawDecoration(
    ctx: CanvasRenderingContext2D,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ) {
    const rect = this.rect;
    if (this.margin) {
      if (Array.isArray(this.margin)) {
        const [top, left, bottom, right] = this.margin;
        ctx.translate(-left, -top);
      } else {
        const all = this.margin;
        ctx.translate(-all, -all);
      }
    }
    if (this.padding) {
      if (Array.isArray(this.padding)) {
        const [top, left] = this.padding;
        ctx.translate(-left, -top);
      } else {
        const all = this.padding;
        ctx.translate(-all, -all);
      }
    }
    if (selection.length > 0 && selection.includes(this)) {
      drawOutline(ctx, rect, "--canvas-selected-color");
    } else if (hovered.length > 0 && hovered.includes(this)) {
      drawOutline(ctx, rect, "--canvas-hovered-color");
    }

    this.child.drawDecoration(ctx, selection, hovered);
  }

  selectAt(point: DOMPoint, level: number): CanvasWidget {
    const hit = super.selectAt(point, level);
    if (hit) return hit;
    const relativePoint = new DOMPoint(
      point.x - this.rect.x,
      point.y - this.rect.y
    );
    const childHit = this.child.selectAt(relativePoint, level - 1);
    if (childHit) return childHit;
    return null;
  }
}

function edgeInset(options: {
  inset?: EdgeInsets;
  callback: (top: number, left: number, bottom: number, right: number) => void;
}) {
  if (options.inset) {
    if (Array.isArray(options.inset)) {
      const [top, left, bottom, right] = options.inset;
      options.callback(top, left, bottom, right);
    } else {
      const all = options.inset;
      options.callback(all, all, all, all);
    }
  }
}
