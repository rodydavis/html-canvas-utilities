import { CanvasContext } from "../widget.js";
import { VectorBase, VectorOptions } from "./base.js";

export interface LineOptions extends VectorOptions {}

export class LineBase extends VectorBase {
  constructor(options: LineOptions) {
    super(options);
    this.rect = options.rect;
  }

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
