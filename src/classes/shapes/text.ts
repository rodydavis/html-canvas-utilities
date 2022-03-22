import { Offset, Size } from "../../utils.js";
import { CanvasContext } from "../widget.js";
import { ShapeBase } from "./base.js";

export class TextShape extends ShapeBase {
  constructor(
    readonly options: {
      characters: string;
      offset: Offset;
      fillColor?: string;
      strokeColor?: string;
      fontSize?: number;
      fontFamily?: string;
      direction?: CanvasDirection;
      textAlign?: CanvasTextAlign;
      textBaseline?: CanvasTextBaseline;
    }
  ) {
    super();
    this.characters = options.characters;
    this.fillColor = options.fillColor;
    this.strokeColor = options.strokeColor;
    this.x = options.offset.x;
    this.y = options.offset.y;
    this.fontSize = options.fontSize ?? 16;
    this.fontFamily = options.fontFamily ?? "sans-serif";
    this.direction = options.direction ?? "inherit";
    this.textAlign = options.textAlign ?? "start";
    this.textBaseline = options.textBaseline ?? "middle";
  }

  fillColor: string;
  strokeColor: string;
  x = 0;
  y = 0;
  characters: string;
  fontSize: number;
  fontFamily: string;
  direction: CanvasDirection;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  removeOnEmpty = true;

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
    ctx.save();
    const { width, height } = this.text(ctx);
    ctx.translate(0, height / 2);
    if (this.fillColor) {
      ctx.fillStyle = context.resolveValue(this.fillColor);
      ctx.fillText(this.characters, 0, 0);
    }
    if (this.strokeColor) {
      ctx.strokeStyle = context.resolveValue(this.strokeColor);
      ctx.strokeText(this.characters, 0, 0);
    }
    ctx.translate(0, -(height / 2));
    ctx.restore();
  }

  text(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.lineWidth;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.direction = this.direction;

    const textWidth = ctx.measureText(this.characters).width;
    const textHeight = this.fontSize;

    return {
      width: textWidth,
      height: textHeight,
    };
  }

  move(delta: Offset): void {
    this.x += delta.x;
    this.y += delta.y;
  }

  get rect(): DOMRect {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const { width, height } = this.text(ctx);
    return new DOMRect(this.x, this.y, width, height);
  }
}
