import { CanvasLayer } from "./layers";
import { CanvasPlugin } from "./plugins/base";
import { pxSize } from "./utils";

export interface CanvasOptions {
  canvas?: HTMLCanvasElement;
  plugins?: CanvasPlugin[];
}

export class CanvasView extends CanvasPlugin {
  constructor(readonly options: CanvasOptions = {}) {
    super();
    this.canvas = options.canvas || document.createElement("canvas");
    this.plugins = options.plugins || [];
    this.init(this.canvas, this.plugins);
    this.plugins.forEach((plugin) => plugin.init(this.canvas, this.plugins));
    window.addEventListener("resize", this.resize.bind(this), false);
  }

  canvas: HTMLCanvasElement;
  plugins: CanvasPlugin[];
  playing = false;
  debug = true;
  layers: CanvasLayer[] = [];

  start() {
    this.playing = true;
    this.resize();
    this.animate(0);
    this.layers.forEach((plugin) => plugin.start(this.ctx));
    this.dispatch(new Event("canvas-start"));
  }

  stop() {
    this.playing = false;
    cancelAnimationFrame(this.animate.bind(this));
    this.layers.forEach((plugin) => plugin.stop(this.ctx));
    this.dispatch(new Event("canvas-stop"));
  }

  resize() {
    const style = getComputedStyle(this.canvas);
    const cw = pxSize(style.width);
    const ch = pxSize(style.height);
    const width = cw || window.innerWidth;
    const height = ch || window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.dispatch(new Event("canvas-resize"));
  }

  clear(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animate(timestamp: number) {
    if (!this.playing) return;
    const ctx = this.canvas.getContext("2d");
    this.clear(ctx);
    this.layers.forEach((layer) => {
      ctx.save();
      layer.paint(ctx, timestamp);
      ctx.restore();
    });
    this.dispatch(new Event("canvas-animate"));
    requestAnimationFrame(this.animate.bind(this));
  }

  addLayer(layer: CanvasLayer) {
    layer.start(this.ctx);
    this.layers.push(layer);
  }

  private dispatch(event: Event) {
    this.canvas.dispatchEvent(event);
    if (this.debug) {
      const data = event instanceof CustomEvent ? event.detail : "";
      console.debug(event.type, data);
    }
  }
}
