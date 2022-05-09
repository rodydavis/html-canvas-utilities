import {
  CanvasLayer,
  CanvasTransformer,
  CanvasView,
  InfiniteGrid,
} from "html-canvas-utilities";

export function basicDemo(canvas: HTMLCanvasElement) {
  const transformer = new CanvasTransformer();
  const controller = new CanvasView({
    canvas,
    plugins: [transformer],
  });
  controller.addLayer(
    new InfiniteGrid({
      plugins: [transformer],
    })
  );
  controller.addLayer(
    new SquareDemo({
      plugins: [transformer],
    })
  );
  controller.start();
}

class SquareDemo extends CanvasLayer {
  offset = new DOMPoint(0, 0);
  size = 100;

  start(ctx: CanvasRenderingContext2D): void {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const x = w / 2 - this.size / 2;
    const y = h / 2 - this.size / 2;
    this.offset = new DOMPoint(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    ctx.fillStyle = "red";
    ctx.fillRect(this.offset.x, this.offset.y, this.size, this.size);
  }
}
