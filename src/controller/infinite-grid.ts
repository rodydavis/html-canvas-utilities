import { color } from "./utils";

export function drawInfiniteGrid(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: {
    offset: { x: number; y: number };
    scale: number;
    backgroundColor: string;
    gridColor: string;
  }
) {
  const { offset, scale, backgroundColor, gridColor } = options;

  ctx.save();

  const gridSize = 20 * scale;
  const gridOffsetX = Math.round(offset.x) % gridSize;
  const gridOffsetY = Math.round(offset.y) % gridSize;

  ctx.fillStyle = color(canvas, backgroundColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color(canvas, gridColor);
  ctx.lineWidth = 0.23 * scale;
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
