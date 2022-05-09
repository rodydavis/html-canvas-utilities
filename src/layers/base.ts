import { CanvasPlugin } from "../plugins";

export interface CanvasLayerOptions {
  plugins?: CanvasPlugin[];
}

export class CanvasLayer {
  constructor(readonly options: CanvasLayerOptions = {}) {
    this.plugins = options.plugins || [];
  }

  plugins: CanvasPlugin[];

  start(ctx: CanvasRenderingContext2D) {}

  stop(ctx: CanvasRenderingContext2D) {}

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

  resize(rect: DOMRect) {
    this.plugins.forEach((plugin) => plugin.resize(rect));
  }
}
