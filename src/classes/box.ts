import { drawOutline } from "../utils.js";
import { RectShape, VectorOptions } from "./shapes/index.js";
import { CanvasContext, CanvasWidget } from "./widget.js";

export type EdgeInsets = number | [number, number, number, number];

export interface BoxOptions extends VectorOptions {
  padding?: EdgeInsets;
  child: CanvasWidget;
}

export class BoxBase extends RectShape {
  constructor(options: BoxOptions) {
    super(options);
    this.padding = options.padding;
    this.child = options.child;
  }

  child: CanvasWidget;
  padding?: EdgeInsets;

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
    let childSize = { ...size };
    const newContext = { ...context, size: childSize };
    super.draw(newContext);
    edgeInset(this.padding, (top, left, bottom, right) => {
      ctx.translate(left, top);
      childSize.width -= left + right;
      childSize.height -= top + bottom;
    });
    this.child.draw(newContext);
  }

  override drawDecoration(
    context: CanvasContext,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ) {
    const { ctx } = context;
    edgeInset(this.padding, (top, left) => {
      ctx.translate(-left, -top);
    });
    const newContext = { ...context, size: this.rect };
    if (selection.length > 0 && selection.includes(this)) {
      drawOutline(newContext, "--canvas-selected-color");
    } else if (hovered.length > 0 && hovered.includes(this)) {
      drawOutline(newContext, "--canvas-hovered-color");
    }
    let childSize = { width: this.rect.width, height: this.rect.height };
    edgeInset(this.padding, (top, left, bottom, right) => {
      ctx.translate(left, top);
      childSize.width -= left + right;
      childSize.height -= top + bottom;
    });
    this.child.drawDecoration(
      {
        ...newContext,
        size: childSize,
      },
      selection,
      hovered
    );
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
