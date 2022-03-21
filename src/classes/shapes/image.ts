import { color, Size } from "../../utils.js";
import { CanvasContext, CanvasWidget } from "../widget.js";
import { RectCornerRadius, RectShape, roundedRect } from "./rect.js";

export class ImageShape extends RectShape {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      cornerRadius?: RectCornerRadius;
      image: string;
      filter?: string;
      smoothingEnabled?: boolean;
      smoothingQuality?: ImageSmoothingQuality;
    }
  ) {
    super(options);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = options.image;
    this.image = img;
    img.onload = () => {
      this.loaded = true;
    };
    img.onerror = () => {
      this.error = true;
      this.loaded = true;
    };
  }
  image: HTMLImageElement;
  loaded = false;
  error = false;
  smoothingEnabled = this.options.smoothingEnabled;
  smoothingQuality = this.options.smoothingQuality;
  filter = this.options.filter;

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
    super.draw(context);
    if (this.error) {
      drawPlaceholder(context, "red");
    } else if (this.loaded) {
      ctx.save();
      if (this.options.smoothingEnabled && this.options.smoothingQuality) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = this.options.smoothingQuality;
      }
      if (this.cornerRadius) {
        if (Array.isArray(this.cornerRadius)) {
          const [tl, tr, br, bl] = this.cornerRadius;
          // Clip corners
          roundedRect(ctx, size, { tl, tr, br, bl });
        } else {
          const r = this.cornerRadius;
          roundedRect(ctx, size, { tl: r, tr: r, br: r, bl: r });
        }
        ctx.clip();
      }
      if (this.filter) {
        ctx.filter = this.filter;
      }
      ctx.drawImage(this.image, 0, 0, size.width, size.height);
      ctx.restore();
    } else {
      drawPlaceholder(context, "--canvas-grid-color");
    }
  }
}

function drawPlaceholder(context: CanvasContext, outlineColor: string): void {
  const { ctx, size } = context;
  ctx.save();
  ctx.fillStyle = context.resolveValue(outlineColor);
  ctx.strokeStyle = context.resolveValue(outlineColor);
  ctx.strokeRect(0, 0, size.width, size.height);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size.width, size.height);
  ctx.moveTo(size.width, 0);
  ctx.lineTo(0, size.height);
  ctx.stroke();
  ctx.restore();
}
