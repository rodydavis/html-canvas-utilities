import { CanvasLayer, CanvasLayerOptions } from "./base";

export interface InlineLayerOptions extends CanvasLayerOptions {
  content: (ctx: CanvasRenderingContext2D, timestamp: number) => void;
}

export class InlineLayer extends CanvasLayer {
  constructor(readonly options: InlineLayerOptions) {
    super(options);
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    this.options.content(ctx, timestamp);
  }
}
