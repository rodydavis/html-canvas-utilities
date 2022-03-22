import { Size } from "../utils";
import { BoxBase, BoxOptions } from "./box";
import { CanvasContext } from "./widget";

export interface FrameOptions extends BoxOptions {
  label: string;
}

export class Frame extends BoxBase {
  constructor(options: FrameOptions) {
    super(options);
    this.label = options.label;
  }
  label: string;

  draw(context: CanvasContext): void {
    this.drawLabel(context);
    super.draw(context);
  }

  drawLabel(context: CanvasContext) {
    const { ctx, scale } = context;
    ctx.scale(1 / scale, 1 / scale);
    const lineHeight = 1.2;
    const fontSize = 10 * lineHeight;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = context.resolveValue("--canvas-text-color");
    const ellipse = "...";
    let textWidth = ctx.measureText(this.label).width;
    const textHeight = fontSize;
    const boxWidth = this.rect.width * scale;
    ctx.translate(0, -6);
    if (textWidth > boxWidth) {
      const ellipsisWidth = ctx.measureText(ellipse).width;
      textWidth = boxWidth - ellipsisWidth;
      let text = this.label;
      text = text.slice(0, -3);
      text += ellipse;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, -textHeight, boxWidth, 20);
      ctx.clip();
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(this.label, 0, 0);
    }
    ctx.translate(0, 6);
    ctx.scale(scale, scale);
  }
}
