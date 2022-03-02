import { CanvasController } from "./controller";

export function addRandomShapes(controller: CanvasController) {
  // Add some shapes
  const shapes = [
    "circle",
    "rect",
    "circle",
    "rect",
    "circle",
    "rect",
    "circle",
    "rect",
    "circle",
    "rect",
  ];
  for (const shape of shapes) {
    const { x, y } = {
      x: Math.random() * controller.canvas.width,
      y: Math.random() * controller.canvas.height,
    };
    const rect = new DOMRect(x, y, 100, 100);
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    // Rectangle
    if (shape === "rect") {
      controller.addChild({
        rect,
        draw: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, rect.width, rect.height);
          ctx.restore();
        },
      });
    }
    // Circle
    if (shape === "circle") {
      controller.addChild({
        rect,
        draw: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            rect.width / 2,
            rect.height / 2,
            rect.width / 2,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = color;
          ctx.fill();
          ctx.restore();
        },
      });
    }
  }
}
