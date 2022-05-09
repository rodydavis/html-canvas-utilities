// import { CanvasContext } from "./classes/widget";

// export function drawInfiniteGrid(
//   context: CanvasContext,
//   options: {
//     backgroundColor: string;
//     gridColor: string;
//   }
// ) {
//   const { ctx, size, scale, offset } = context;
//   const { backgroundColor, gridColor } = options;
//   const canvas = ctx.canvas;
//   ctx.save();

//   const gridSize = 20 * scale;
//   const gridOffsetX = Math.round(offset.x) % gridSize;
//   const gridOffsetY = Math.round(offset.y) % gridSize;

//   ctx.fillStyle = context.resolveValue(backgroundColor);
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   ctx.strokeStyle = context.resolveValue(gridColor);
//   ctx.lineWidth = 0.23 * scale;
//   //   ctx.setLineDash([5, 5]);

//   for (let x = gridOffsetX; x < canvas.width; x += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
//   }

//   for (let y = gridOffsetY; y < canvas.height; y += gridSize) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }

//   ctx.restore();
// }
