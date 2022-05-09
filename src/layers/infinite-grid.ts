import { CanvasTransformer } from "../plugins/transformer";
import { cssValue } from "../utils/style";
import { TransformableLayer } from "./transformable";

export class InfiniteGrid extends TransformableLayer {
  offset: { x: number; y: number } = { x: 0, y: 0 };
  scale = 1;
  backgroundColor: string = "#FFF";
  gridColor: string = "#000";

  animate(timestamp: number): void {
    if (this.controller) {
      const info = this.controller.info;
      this.offset = info.offset;
      this.scale = info.scale;
    }
  }

  beforeDraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    const { backgroundColor, gridColor, scale, offset } = this;
    const canvas = ctx.canvas;
    const canvasScale = scale;
    ctx.save();

    const gridSize = 20 * canvasScale;
    const gridOffsetX = Math.round(offset.x) % gridSize;
    const gridOffsetY = Math.round(offset.y) % gridSize;

    ctx.fillStyle = cssValue(canvas, backgroundColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = cssValue(canvas, gridColor);
    ctx.lineWidth = 0.23 * canvasScale;
    //   ctx.setLineDash([5, 5]);

    for (let x = gridOffsetX; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = gridOffsetY; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.restore();
  }
}
