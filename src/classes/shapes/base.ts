import { CanvasWidget } from "../widget.js";

export abstract class ShapeBase extends CanvasWidget {
  abstract fillColor?: string;
  abstract strokeColor?: string;
  lineWidth: number = 1;
}
