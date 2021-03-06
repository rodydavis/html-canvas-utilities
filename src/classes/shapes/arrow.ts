import { CanvasContext } from "../widget.js";
import { LineBase, LineOptions } from "./line.js";

export type ArrowType = "none" | "line-arrow" | "triangle-arrow";

export interface ArrowOptions extends LineOptions {
  startArrow?: ArrowType;
  endArrow?: ArrowType;
}

export class ArrowShape extends LineBase {
  constructor(options: ArrowOptions) {
    super(options);
    this.startArrow = options.startArrow || "none";
    this.endArrow = options.endArrow || "line-arrow";
  }

  private _startArrow: ArrowType;
  get startArrow(): ArrowType {
    return this._startArrow;
  }
  set startArrow(value: ArrowType) {
    this._startArrow = value;
    this.notifyListeners();
  }

  private _endArrow: ArrowType;
  get endArrow(): ArrowType {
    return this._endArrow;
  }
  set endArrow(value: ArrowType) {
    this._endArrow = value;
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
    const { width } = size;
    const start = new DOMPoint(0, 0);
    const end = new DOMPoint(width, 0);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();

    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }

    if (this.startArrow) {
      drawArrowHead(ctx, start, this.startArrow);
    }
    if (this.endArrow) {
      drawArrowHead(ctx, end, this.endArrow);
    }
    if (this.fillColor) {
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  point: DOMPoint,
  type: ArrowType
) {
  const { x, y } = point;
  const arrowWidth = 10;
  const arrowHeight = 10;
  if (type === "line-arrow") {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - arrowWidth, y - arrowHeight);
    ctx.moveTo(x - arrowWidth, y + arrowHeight);
    ctx.lineTo(x, y);
  }
  if (type === "triangle-arrow") {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - arrowWidth, y - arrowHeight);
    ctx.lineTo(x - arrowWidth, y + arrowHeight);
    ctx.lineTo(x, y);
    ctx.closePath();
  }
}
