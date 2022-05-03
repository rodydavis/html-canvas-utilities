import { Offset } from "../../utils.js";
import { CanvasContext } from "../widget.js";
import { ShapeBase, ShapeOptions } from "./base.js";

export interface TextOptions extends ShapeOptions {
  characters: string;
  offset: Offset;
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  direction?: CanvasDirection;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

export class TextShape extends ShapeBase {
  constructor(options: TextOptions) {
    super();
    this.characters = options.characters;
    this.backgroundColor = options.backgroundColor;
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

  private _x = 0;
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this.notifyListeners();
  }

  private _y = 0;
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this.notifyListeners();
  }

  private _characters: string;
  get characters(): string {
    return this._characters;
  }
  set characters(value: string) {
    this._characters = value;
    this.notifyListeners();
  }

  private _fontSize: number;
  get fontSize(): number {
    return this._fontSize;
  }
  set fontSize(value: number) {
    this._fontSize = value;
    this.notifyListeners();
  }

  private _fontFamily: string;
  get fontFamily(): string {
    return this._fontFamily;
  }
  set fontFamily(value: string) {
    this._fontFamily = value;
    this.notifyListeners();
  }

  private _backgroundColor: string;
  get backgroundColor(): string {
    return this._backgroundColor;
  }
  set backgroundColor(value: string) {
    this._backgroundColor = value;
    this.notifyListeners();
  }

  private _direction: CanvasDirection;
  get direction(): CanvasDirection {
    return this._direction;
  }
  set direction(value: CanvasDirection) {
    this._direction = value;
    this.notifyListeners();
  }

  private _textAlign: CanvasTextAlign;
  get textAlign(): CanvasTextAlign {
    return this._textAlign;
  }
  set textAlign(value: CanvasTextAlign) {
    this._textAlign = value;
    this.notifyListeners();
  }

  private _textBaseline: CanvasTextBaseline;
  get textBaseline(): CanvasTextBaseline {
    return this._textBaseline;
  }
  set textBaseline(value: CanvasTextBaseline) {
    this._textBaseline = value;
    this.notifyListeners();
  }

  removeOnEmpty = true;

  draw(context: CanvasContext): void {
    const { ctx, size } = context;
    ctx.save();
    const { width, height } = this.text(ctx);
    ctx.translate(0, height / 2);
    if (this.backgroundColor) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
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
