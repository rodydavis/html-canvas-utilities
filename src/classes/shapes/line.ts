import { color, Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
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

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    if (this.fillColor) {
      ctx.fillStyle = color(ctx.canvas, this.fillColor);
    }
    if (this.strokeColor) {
      ctx.strokeStyle = color(ctx.canvas, this.strokeColor);
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
