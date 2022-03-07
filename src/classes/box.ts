import { Size } from "../utils.js";
import { RectShape } from "./shapes/index.js";
import { CanvasWidget } from "./widget.js";

export class BoxBase extends RectShape {
  constructor(
    readonly options: {
      rect: DOMRect;
      fillColor?: string;
      strokeColor?: string;
      child: CanvasWidget;
    }
  ) {
    super(options);
  }

  child = this.options.child;

  draw(ctx: CanvasRenderingContext2D, size: Size): void {
    super.draw(ctx, size);
    this.child.draw(ctx, size, this.rect);
  }
}
