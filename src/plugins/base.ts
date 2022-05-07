export abstract class CanvasPlugin {
  canvas: HTMLCanvasElement;
  plugins: CanvasPlugin[];

  init(canvas: HTMLCanvasElement, plugins: CanvasPlugin[]) {
    this.canvas = canvas;
    this.plugins = plugins;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d");
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number) {}

  beforeDraw(ctx: CanvasRenderingContext2D, timestamp: number) {}

  afterDraw(ctx: CanvasRenderingContext2D, timestamp: number) {}

  animate(timestamp: number) {}
}
