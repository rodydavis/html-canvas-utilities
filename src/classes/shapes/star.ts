import { color, Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
import { PolygonShape } from "./polygon.js";

export class StarShape extends PolygonShape {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      pointCount?: number;
      innerRadius?: number;
      outerRadius?: number;
    }
  ) {
    super(options);
  }
  fillColor? = this.options.fillColor;
  strokeColor? = this.options.strokeColor;
  rect = this.options.rect;
  pointCount = this.options.pointCount || 5;
  innerRadius = this.options.innerRadius;
  outerRadius = this.options.outerRadius;
  children?: CanvasWidget[];

  override draw(ctx: CanvasRenderingContext2D, size: Size): void {
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
    const innerRadius = this.innerRadius || radiusX / 2;
    const outerRadius = this.outerRadius || width / 2;

    let rot = (Math.PI / 2) * 3;
    let x = radiusX;
    let y = radiusY;
    let step = Math.PI / this.pointCount;
    ctx.beginPath();
    ctx.moveTo(radiusX, radiusY - outerRadius);
    for (let i = 0; i < this.pointCount; i++) {
      x = radiusX + Math.cos(rot) * outerRadius;
      y = radiusY + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = radiusX + Math.cos(rot) * innerRadius;
      y = radiusY + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(radiusX, radiusY - outerRadius);
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
