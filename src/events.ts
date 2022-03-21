import { Offset } from "./utils.js";

export interface CanvasEvent {
  type: "click" | "hover";
}

export interface ClickEvent extends CanvasEvent {
  type: "click";
  offset: Offset;
}

export interface HoverEvent extends CanvasEvent {
  type: "hover";
  offset: Offset;
}
