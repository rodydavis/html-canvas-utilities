import {
  CanvasLayer,
  CanvasTransformer,
  CanvasView,
  InfiniteGrid,
} from "html-canvas-utilities";

export function canvasDemo(canvas: HTMLCanvasElement) {
  const transformer = new CanvasTransformer();
  const controller = new CanvasView({
    canvas,
    plugins: [transformer],
  });
  
  const bgLayer = new InfiniteGrid({
    plugins: [transformer],
  });
  controller.addLayer(bgLayer);

  const layer = new SquareDemo({
    plugins: [transformer],
  });
  controller.addLayer(layer);

  controller.start();
}

class SquareDemo extends CanvasLayer {
  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    const x = Math.sin(timestamp / 1000) * 100;
    const y = Math.cos(timestamp / 1000) * 100;
    const offset = 100;
    ctx.fillStyle = "red";
    ctx.fillRect(x + offset, y + offset, 100, 100);
  }
}
