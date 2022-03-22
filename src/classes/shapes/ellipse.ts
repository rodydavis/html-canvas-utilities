import { color, Size } from "../../utils.js";
import { CanvasContext, CanvasWidget } from "../widget.js";
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

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
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
      ctx.fillStyle = context.resolveValue(this.fillColor);
    }
    if (this.strokeColor) {
      ctx.strokeStyle = context.resolveValue(this.strokeColor);
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
