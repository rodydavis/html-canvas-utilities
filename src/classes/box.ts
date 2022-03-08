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
      child: CanvasWidget;
    }
  ) {
    super(options);
  }

  child = this.options.child;
  padding = this.options.padding;

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    let childSize = { ...size };
    super.draw(ctx, childSize);
    edgeInset(this.padding, (top, left, bottom, right) => {
      ctx.translate(left, top);
      childSize.width -= left + right;
      childSize.height -= top + bottom;
    });
    this.child.draw(ctx, childSize, this.rect);
  }

  override drawDecoration(
    ctx: CanvasRenderingContext2D,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ) {
    edgeInset(this.padding, (top, left) => {
      ctx.translate(-left, -top);
    });
    if (selection.length > 0 && selection.includes(this)) {
      drawOutline(ctx, this.rect, "--canvas-selected-color");
    } else if (hovered.length > 0 && hovered.includes(this)) {
      drawOutline(ctx, this.rect, "--canvas-hovered-color");
    }
    let childSize = { width: this.rect.width, height: this.rect.height };
    edgeInset(this.padding, (top, left, bottom, right) => {
      ctx.translate(left, top);
      childSize.width -= left + right;
      childSize.height -= top + bottom;
    });
    this.child.drawDecoration(ctx, selection, hovered, childSize);
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

function edgeInset(
  inset: EdgeInsets | undefined,
  callback: (top: number, left: number, bottom: number, right: number) => void
) {
  if (inset) {
    if (Array.isArray(inset)) {
      const [top, left, bottom, right] = inset;
      callback(top, left, bottom, right);
    } else {
      const all = inset;
      callback(all, all, all, all);
    }
  }
}
