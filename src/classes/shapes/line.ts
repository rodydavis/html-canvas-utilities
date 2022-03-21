import { color, Size } from "../../utils.js";
import { CanvasContext, CanvasWidget } from "../widget.js";
import { ShapeBase } from "./base.js";

export class LineBase extends ShapeBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
    }
  ) {
    super();
  }
  fillColor? = this.options.fillColor;
  strokeColor? = this.options.strokeColor;
  rect = this.options.rect;
  children?: CanvasWidget[];

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    if (this.fillColor) {
      ctx.fillStyle = context.resolveValue(this.fillColor);
    }
    if (this.strokeColor) {
      ctx.strokeStyle = context.resolveValue(this.strokeColor);
    }
    const { width } = size;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
    ctx.restore();
  }
}
