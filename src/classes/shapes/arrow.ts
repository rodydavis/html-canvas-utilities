import { color, Size } from "../../utils.js";
import { CanvasContext } from "../widget.js";
import { LineBase } from "./line.js";

export type ArrowType = "none" | "line-arrow" | "triangle-arrow";

export class ArrowShape extends LineBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      startArrow?: ArrowType;
      endArrow?: ArrowType;
    }
  ) {
    super(options);
  }
  startArrow = this.options.startArrow || "none";
  endArrow = this.options.endArrow || "line-arrow";

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
