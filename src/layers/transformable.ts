import { CanvasTransformer } from "../plugins/transformer";
import { CanvasLayer } from "./base";

export class TransformableLayer extends CanvasLayer {
  controller?: CanvasTransformer;

  start(ctx: CanvasRenderingContext2D): void {
    this.plugins.forEach((plugin) => {
      if (plugin instanceof CanvasTransformer) {
        this.controller = plugin;
      }
    });
  }
}
