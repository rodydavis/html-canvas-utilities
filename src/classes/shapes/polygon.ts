import { color, Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
import { ShapeBase } from "./base.js";

export class PolygonShape extends ShapeBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      pointCount?: number;
    }
  ) {
    super();
  }
  fillColor? = this.options.fillColor;
  strokeColor? = this.options.strokeColor;
  rect = this.options.rect;
  pointCount = this.options.pointCount || 5;
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
    const { width, height } = size;
    const radiusX = width / 2;
    const radiusY = height / 2;
    // ctx.translate(radiusX, radiusY);
    // Draw polygon
    ctx.beginPath();
    for (let i = 0; i < this.pointCount; i++) {
      const angle = (Math.PI * 2) / this.pointCount;
      const x = radiusX + radiusX * Math.cos(angle * i);
      const y = radiusY + radiusY * Math.sin(angle * i);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
    ctx.restore();
  }
}
