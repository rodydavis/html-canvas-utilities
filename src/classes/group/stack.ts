import { Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
import { GroupBase } from "./base.js";

export class StackGroup extends GroupBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      children: CanvasWidget[];
      clip?: boolean;
    }
  ) {
    super();
  }

  children = this.options.children;
  rect = this.options.rect;
  clip = this.options.clip ?? true;

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    ctx.save();
    if (this.clip) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, size.width, size.height);
      ctx.clip();
    }
    for (const item of this.children) {
      ctx.translate(item.rect.x, item.rect.y);
      item.draw(ctx, item.rect, this.rect);
      ctx.translate(-item.rect.x, -item.rect.y);
    }
    ctx.restore();
  }

  selectAt(point: DOMPoint, level: number): CanvasWidget {
    const hit = super.selectAt(point, level);
    if (hit) return hit;
    for (const item of Array.from(this.children).reverse()) {
      const relativePoint = new DOMPoint(
        point.x - this.rect.x,
        point.y - this.rect.y
      );
      const childHit = item.selectAt(relativePoint, level - 1);
      if (childHit) return childHit;
    }
    return null;
  }

  drawDecoration(
    ctx: CanvasRenderingContext2D,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ): void {
    super.drawDecoration(ctx, selection, hovered);
    for (const item of this.children) {
      ctx.translate(item.rect.x, item.rect.y);
      item.drawDecoration(ctx, selection, hovered);
      ctx.translate(-item.rect.x, -item.rect.y);
    }
  }
}

// export class Positioned {
//   constructor(
//     readonly options: {
//       child: CanvasWidget;
//       top?: number;
//       left?: number;
//       bottom?: number;
//       right?: number;
//       width?: number;
//       height?: number;
//     }
//   ) {}
// }
