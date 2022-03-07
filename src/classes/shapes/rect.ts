import { color, Size } from "../../utils.js";
import { CanvasWidget } from "../widget.js";
import { ShapeBase } from "./base.js";

export type RectCornerRadius = number | [number, number, number, number];

export class RectShape extends ShapeBase {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      cornerRadius?: RectCornerRadius;
    }
  ) {
    super();
  }
  fillColor = this.options.fillColor;
  strokeColor = this.options.strokeColor;
  rect = this.options.rect;
  cornerRadius?: RectCornerRadius = this.options.cornerRadius;
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
    if (this.cornerRadius) {
      if (Array.isArray(this.cornerRadius)) {
        const [tl, tr, br, bl] = this.cornerRadius;
        roundedRect(ctx, size, { tl, tr, br, bl });
        if (this.fillColor) {
          ctx.fill();
        }
        if (this.strokeColor) {
          ctx.stroke();
        }
      } else {
        const r = this.cornerRadius;
        roundedRect(ctx, size, { tl: r, tr: r, br: r, bl: r });
        if (this.fillColor) {
          ctx.fill();
        }
        if (this.strokeColor) {
          ctx.stroke();
        }
      }
    } else {
      if (this.fillColor) {
        ctx.fillRect(0, 0, size.width, size.height);
      }
      if (this.strokeColor) {
        ctx.strokeRect(0, 0, size.width, size.height);
      }
    }
    ctx.restore();
  }
}

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  size: Size,
  options: {
    tl: number;
    tr: number;
    br: number;
    bl: number;
  }
) {
  const { tl, tr, br, bl } = options;
  ctx.beginPath();
  ctx.moveTo(tl, 0);
  ctx.lineTo(size.width - tr, 0);
  ctx.quadraticCurveTo(size.width, 0, size.width, tr);
  ctx.lineTo(size.width, size.height - br);
  ctx.quadraticCurveTo(size.width, size.height, size.width - br, size.height);
  ctx.lineTo(bl, size.height);
  ctx.quadraticCurveTo(0, size.height, 0, size.height - bl);
  ctx.lineTo(0, tl);
  ctx.quadraticCurveTo(0, 0, tl, 0);
  ctx.closePath();
}
