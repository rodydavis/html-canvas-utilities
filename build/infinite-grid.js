import { color } from "./utils";
export function drawInfiniteGrid(canvas, ctx, options) {
    var offset = options.offset, scale = options.scale, backgroundColor = options.backgroundColor, gridColor = options.gridColor;
    ctx.save();
    var gridSize = 20 * scale;
    var gridOffsetX = Math.round(offset.x) % gridSize;
    var gridOffsetY = Math.round(offset.y) % gridSize;
    ctx.fillStyle = color(canvas, backgroundColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color(canvas, gridColor);
    ctx.lineWidth = 0.23 * scale;
    //   ctx.setLineDash([5, 5]);
    for (var x = gridOffsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var y = gridOffsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.restore();
}
//# sourceMappingURL=infinite-grid.js.map