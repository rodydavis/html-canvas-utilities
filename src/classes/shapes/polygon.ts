import { CanvasContext } from "../widget.js";
import { VectorBase, VectorOptions } from "./base.js";

export interface PolygonOptions extends VectorOptions {
  pointCount?: number;
}

export class PolygonShape extends VectorBase {
  constructor(options: PolygonOptions) {
    super(options);
    this.pointCount = options.pointCount || 5;
  }

  private _pointCount: number;
  get pointCount(): number {
    return this._pointCount;
  }
  set pointCount(value: number) {
    this._pointCount = value;
    this.notifyListeners();
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
