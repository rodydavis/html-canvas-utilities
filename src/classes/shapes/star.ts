import { CanvasContext } from "../widget.js";
import { PolygonOptions, PolygonShape } from "./polygon.js";

export interface StarOptions extends PolygonOptions {
  innerRadius?: number;
  outerRadius?: number;
}

export class StarShape extends PolygonShape {
  constructor(options: StarOptions) {
    super(options);
    this.innerRadius = options.innerRadius;
    this.outerRadius = options.outerRadius;
  }

  private _innerRadius?: number;
  get innerRadius(): number {
    return this._innerRadius;
  }
  set innerRadius(value: number) {
    this._innerRadius = value;
    this.notifyListeners();
  }

  private _outerRadius?: number;
  get outerRadius(): number {
    return this._outerRadius;
  }
  set outerRadius(value: number) {
    this._outerRadius = value;
    this.notifyListeners();
  }

  override draw(context: CanvasContext): void {
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
