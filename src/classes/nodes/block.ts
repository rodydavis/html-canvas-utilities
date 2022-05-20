import { Offset, Size } from "../../utils";
import { TextShape, roundedRect } from "../shapes";
import { CanvasWidget, CanvasContext } from "../widget";
import { Connection } from "./connection";

export interface BlockOptions {
  offset: Offset;
  label?: string;
}

export const CONNECTION_SIZE = 5;
export const PADDING = CONNECTION_SIZE / 2;

export class Block extends CanvasWidget {
  constructor(options: BlockOptions) {
    super();
    this.label = options.label ?? "";
    this.rect = new DOMRect(options.offset.x, options.offset.y, 0, 0);
  }

  rect: DOMRect;
  label: string;
  private _inputs: Connection[] = [];
  private _outputs: Connection[] = [];

  addInput(input: Connection) {
    input.connectTo(this);
    this._inputs.push(input);
  }

  addOutput(output: Connection) {
    output.connectFrom(this);
    this._outputs.push(output);
  }

  get inputs() {
    return this._inputs;
  }

  get outputs() {
    return this._outputs;
  }

  inputPosition(val: number | Connection, relative = true) {
    const index = typeof val === "number" ? val : this.inputs.indexOf(val);
    const point = {
      x: PADDING / 2,
      y: PADDING / 2 + (CONNECTION_SIZE + PADDING) * index,
    };
    if (!relative) {
      point.x += this.rect.x;
      point.y += this.rect.y;
    }
    return point;
  }

  outputPosition(val: number | Connection, relative = true) {
    const index = typeof val === "number" ? val : this.outputs.indexOf(val);
    const point = {
      x: this.rect.width - PADDING / 2 - CONNECTION_SIZE,
      y: PADDING / 2 + (CONNECTION_SIZE + PADDING) * index,
    };
    if (!relative) {
      point.x += this.rect.x;
      point.y += this.rect.y;
    }
    return point;
  }

  buildLabel(context: CanvasContext) {
    const labelX = this.rect.x;
    const labelY = this.rect.y + this.rect.height / 2;
    return new TextShape({
      offset: { x: labelX, y: labelY },
      characters: this.label,
      fillColor: context.resolveValue("--canvas-text-color"),
    });
  }

  draw(context: CanvasContext, _parent?: Size): void {
    const { ctx, resolveValue } = context;
    this.checkSize(context);
    const { width, height } = this.rect;

    // Draw background
    ctx.save();
    ctx.fillStyle = resolveValue("--block-background-color");
    const r = CONNECTION_SIZE / 4;
    const w = width - CONNECTION_SIZE;
    const h = height;
    ctx.translate(CONNECTION_SIZE / 2, 0);
    roundedRect(ctx, { width: w, height: h }, { tl: r, tr: r, br: r, bl: r });
    ctx.fill();
    ctx.strokeStyle = resolveValue("--block-border-color");
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = resolveValue("--block-node-color");
    ctx.strokeStyle = resolveValue("--block-node-color");

    // Draw inputs
    for (let i = 0; i <= this.inputs.length; i++) {
      ctx.save();
      const pos = this.inputPosition(i);
      ctx.translate(pos.x, pos.y);
      circleRect(ctx, CONNECTION_SIZE);
      if (i === this.inputs.length) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw outputs
    for (let i = 0; i <= this.outputs.length; i++) {
      ctx.save();
      const pos = this.outputPosition(i);
      ctx.translate(pos.x, pos.y);
      circleRect(ctx, CONNECTION_SIZE);
      if (i === this.outputs.length) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw label
    ctx.save();
    this.drawLabel(context);
    ctx.restore();
  }

  checkSize(_context: CanvasContext) {
    const inputs = this.inputs.length + 1;
    const inputsHeight = inputs * (CONNECTION_SIZE + PADDING);
    const outputs = this.outputs.length + 1;
    const outputsHeight = outputs * (CONNECTION_SIZE + PADDING);
    this.rect.height = Math.max(inputsHeight, outputsHeight) + PADDING * 2;
    this.rect.width = CONNECTION_SIZE * 2 + CONNECTION_SIZE * 10;
  }

  drawLabel(context: CanvasContext) {
    const { ctx, scale } = context;
    ctx.scale(1 / scale, 1 / scale);
    const lineHeight = 1.2;
    const fontSize = 10 * lineHeight;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = context.resolveValue("--canvas-text-color");
    const ellipse = "...";
    let textWidth = ctx.measureText(this.label).width;
    const textHeight = fontSize;
    const boxWidth = this.rect.width * scale;
    ctx.translate(0, -6);
    if (textWidth > boxWidth) {
      const ellipsisWidth = ctx.measureText(ellipse).width;
      textWidth = boxWidth - ellipsisWidth;
      let text = this.label;
      text = text.slice(0, -3);
      text += ellipse;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, -textHeight, boxWidth, 20);
      ctx.clip();
      ctx.fillText(text, 0, 0);
      ctx.restore();
    } else {
      const textX = (boxWidth - textWidth) / 2;
      const textY = 0;
      ctx.fillText(this.label, textX, textY);
    }
    ctx.translate(0, 6);
    ctx.scale(scale, scale);
  }
}

function circleRect(ctx: CanvasRenderingContext2D, size: number) {
  const r = size / 2;
  roundedRect(
    ctx,
    { width: size, height: size },
    { tl: r, tr: r, br: r, bl: r }
  );
}
