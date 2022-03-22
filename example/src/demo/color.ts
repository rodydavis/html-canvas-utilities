import { CanvasController, RectShape } from "html-canvas-utilities";

export function colorDemo(controller: CanvasController) {
  //   const stops = [0, 0.25, 0.5, 0.75, 1];
  const rect = new RectShape({
    rect: new DOMRect(100, 500, 150, 150),
    fillColor: "hsl(0, 100%, 50%)",
  });
  rect.onUpdate = (time) => {
    const t = time / 3000;
    const { h } = hsl(rect.fillColor);
    const amount = (Math.sin(t) + 1) / 2;
    const hue = (h + 360 * amount) % 360;
    rect.fillColor = `hsl(${hue}, 100%, 50%)`;
  };
  controller.addChild(rect);
}

function hsl(color: string) {
  const m = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(color);
  if (m) {
    return {
      h: parseInt(m[1]),
      s: parseFloat(m[2]),
      l: parseFloat(m[3]),
    };
  }
  return { h: 0, s: 0, l: 0 };
}
