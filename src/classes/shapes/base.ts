import { CanvasWidget } from "../widget.js";

export interface ShapeOptions {
  fillColor?: string;
  strokeColor?: string;
  lineWidth?: number;
}

export abstract class ShapeBase extends CanvasWidget {
  constructor(options?: ShapeOptions) {
    super();
    this._fillColor = options?.fillColor;
    this._strokeColor = options?.strokeColor;
    this._lineWidth = options?.lineWidth ?? 1;
  }

  private _fillColor?: string;
  get fillColor(): string {
    return this._fillColor;
  }
  set fillColor(value: string) {
    this._fillColor = value;
    this.notifyListeners();
  }

  private _strokeColor?: string;
  get strokeColor(): string {
    return this._strokeColor;
  }
  set strokeColor(value: string) {
    this._strokeColor = value;
    this.notifyListeners();
  }

  private _lineWidth: number;
  get lineWidth(): number {
    return this._lineWidth;
  }
  set lineWidth(value: number) {
    this._lineWidth = value;
    this.notifyListeners();
  }
}

export interface VectorOptions extends ShapeOptions {
  rect: DOMRect;
}

export abstract class VectorBase extends ShapeBase {
  constructor(options: VectorOptions) {
    super(options);
    this._rect = options.rect;
  }

  private _rect: DOMRect;
  get rect(): DOMRect {
    return this._rect;
  }
  set rect(value: DOMRect) {
    this._rect = value;
    this.notifyListeners();
  }
}
