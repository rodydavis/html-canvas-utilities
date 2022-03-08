export function color(elem: HTMLElement, value: string) {
  if (value.startsWith("--")) {
    const style = getComputedStyle(elem);
    return style.getPropertyValue(value);
  }
  return value;
}

export function outerRect(rects: Rect[]) {
  if (rects.length === 0) {
    return new DOMRect(0, 0, 0, 0);
  }
  const rect = new DOMRect(
    rects[0].x,
    rects[0].y,
    rects[0].width,
    rects[0].height
  );
  return rects.reduce((acc, cur) => {
    if (cur.x < acc.x) {
      acc.width += acc.x - cur.x;
      acc.x = cur.x;
    }
    if (cur.y < acc.y) {
      acc.height += acc.y - cur.y;
      acc.y = cur.y;
    }
    if (cur.x + cur.width > acc.x + acc.width) {
      acc.width = cur.x + cur.width - acc.x;
    }
    if (cur.y + cur.height > acc.y + acc.height) {
      acc.height = cur.y + cur.height - acc.y;
    }
    return acc;
  }, rect);
}

export function drawOutline(
  ctx: CanvasRenderingContext2D,
  size: Size,
  strokeColor: string
) {
  ctx.save();
  ctx.strokeStyle = color(ctx.canvas, strokeColor);
  ctx.strokeRect(0, 0, size.width, size.height);
  ctx.restore();
}

export interface Offset {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Rect = Offset & Size;