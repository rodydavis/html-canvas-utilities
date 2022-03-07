import { color, Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
import { ShapeBase } from "./base.js";

export class EllipseShape extends ShapeBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      counterclockwise?: boolean;
    }
  ) {
    super();
  }

  fillColor? = this.options.fillColor;
  strokeColor? = this.options.strokeColor;
  rect = this.options.rect;
  children?: CanvasWidget[];
  counterclockwise = this.options.counterclockwise || false;

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    ctx.save();
    const { width, height } = size;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;
    const rotation = 0;
    const counterclockwise = false;
    ctx.lineWidth = this.lineWidth;
    if (this.fillColor) {
      ctx.fillStyle = color(ctx.canvas, this.fillColor);
    }
    if (this.strokeColor) {
      ctx.strokeStyle = color(ctx.canvas, this.strokeColor);
    }
    ctx.translate(radiusX, radiusY);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise
    );
    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
    ctx.restore();
  }
}
