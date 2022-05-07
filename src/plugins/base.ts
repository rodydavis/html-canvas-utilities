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

export class CanvasLayer {
  constructor(
    readonly options: {
      plugins?: CanvasPlugin[];
    } = {}
  ) {
    this.plugins = options.plugins || [];
  }

  plugins: CanvasPlugin[];

  draw(ctx: CanvasRenderingContext2D, timestamp: number) {
    this.plugins.forEach((plugin) => plugin.draw(ctx, timestamp));
  }

  beforeDraw(ctx: CanvasRenderingContext2D, timestamp: number) {
    this.plugins.forEach((plugin) => plugin.beforeDraw(ctx, timestamp));
  }

  afterDraw(ctx: CanvasRenderingContext2D, timestamp: number) {
    this.plugins.forEach((plugin) => plugin.afterDraw(ctx, timestamp));
  }

  animate(timestamp: number) {
    this.plugins.forEach((plugin) => plugin.animate(timestamp));
  }

  paint(ctx: CanvasRenderingContext2D, timestamp: number) {
    this.animate(timestamp);
    this.beforeDraw(ctx, timestamp);
    this.draw(ctx, timestamp);
    this.afterDraw(ctx, timestamp);
  }
}
