import { CanvasContext } from "../widget.js";
import { VectorBase, VectorOptions } from "./base.js";

export interface EllipseOptions extends VectorOptions {
  counterclockwise?: boolean;
}

export class EllipseShape extends VectorBase {
  constructor(options: EllipseOptions) {
    super(options);
    this.counterclockwise = options.counterclockwise ?? false;
  }

  private _counterclockwise: boolean;
  get counterclockwise(): boolean {
    return this._counterclockwise;
  }
  set counterclockwise(value: boolean) {
    this._counterclockwise = value;
    this.notifyListeners();
  }

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
