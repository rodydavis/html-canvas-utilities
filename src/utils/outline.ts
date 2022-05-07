import { CanvasContext } from "../classes";

export function drawOutline(context: CanvasContext, strokeColor: string) {
  const { ctx, size } = context;
  ctx.save();
  ctx.strokeStyle = context.resolveValue(strokeColor);
  ctx.strokeRect(0, 0, size.width, size.height);
  ctx.restore();
}
