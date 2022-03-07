import { color, drawOutline, Size } from "../utils.js";

export abstract class CanvasWidget {
  abstract rect: DOMRect;
  abstract draw(ctx: CanvasRenderingContext2D, size: Size): void;

  selectAt(point: DOMPoint, level: number): CanvasWidget | null {
    const rect = this.rect;
    if (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    ) {
      if (level === 0) return this;
    }
    return null;
  }

  drawDecoration(
    ctx: CanvasRenderingContext2D,
    selection: CanvasWidget[],
    hovered: CanvasWidget[]
  ) {
    if (selection.length > 0 && selection.includes(this)) {
      drawOutline(ctx, this.rect, "--canvas-selected-color");
    } else if (hovered.length > 0 && hovered.includes(this)) {
      drawOutline(ctx, this.rect, "--canvas-hovered-color");
    }
  }
}
