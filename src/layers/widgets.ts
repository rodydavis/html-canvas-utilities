import { CanvasWidget } from "../classes";
import { cssValue } from "../utils/style";
import { CanvasLayerOptions } from "./base";
import { TransformableLayer } from "./transformable";

export interface WidgetsLayerOptions extends CanvasLayerOptions {
  children?: CanvasWidget[];
}

export class WidgetsLayer extends TransformableLayer {
  constructor(readonly options: WidgetsLayerOptions = {}) {
    super(options);
    this.children = options.children ?? [];
  }

  children: CanvasWidget[];

  getContext(ctx: CanvasRenderingContext2D) {
    return {
      ctx,
      size: {
        width: ctx.canvas.width,
        height: ctx.canvas.height,
      },
      scale: 1,
      offset: { x: 0, y: 0 },
      resolveValue: (value: string) => cssValue(ctx.canvas, value),
    };
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    this.children.forEach((child) => {
      ctx.save();
      this.controller?.applyTransform(ctx);
      const offset = child.offset;
      ctx.translate(offset.x, offset.y);
      const context = this.getContext(ctx);
      context.size = child.size;
      if (this.controller) {
        const info = this.controller.info;
        context.scale = info.scale;
        context.offset = info.offset;
      }
      child.draw(context);
      ctx.restore();
    });
  }

  animate(timestamp: number): void {
    this.children.forEach((child) => {
      child.onUpdate(timestamp);
    });
  }

  addChild(child: CanvasWidget) {
    this.children.push(child);
  }
}
