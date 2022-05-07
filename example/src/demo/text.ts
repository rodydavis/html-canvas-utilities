import { CanvasController, TextShape } from "html-canvas-utilities";

export function addText(controller: CanvasController) {
  const text = new TextShape({
    offset: { x: 75, y: 300 },
    characters: "Hello",
    fontFamily: "Arial",
    fillColor: "--canvas-text-color, red",
  });
  controller.addChild(text);
}
