import { Offset } from "./utils.js";

export interface CanvasEvent {
  type: "click" | "hover" | "update";
}

export interface ClickEvent extends CanvasEvent {
  type: "click";
  offset: Offset;
}

export interface HoverEvent extends CanvasEvent {
  type: "hover";
  offset: Offset;
}

export interface FrameUpdate extends CanvasEvent {
  type: "update";
  time: number;
}
