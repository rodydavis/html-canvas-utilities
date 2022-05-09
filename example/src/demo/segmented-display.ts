import { RectShape, WidgetsLayer } from "html-canvas-utilities";

const padding = 2;
const size = { width: 50, height: 50 };
const offset = { x: 250, y: 250 };

export function displayDemo(layer: WidgetsLayer) {
  // Spell out "Hello" in boxes
  const width = (size.width + padding) * 3 + size.width / 2;

  eightSegmentDisplay(layer, offset.x, [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ]);
  eightSegmentDisplay(layer, offset.x + width, [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ]);
  eightSegmentDisplay(layer, offset.x + width * 2, [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ]);
  eightSegmentDisplay(layer, offset.x + width * 3, [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ]);
  eightSegmentDisplay(layer, offset.x + width * 4, [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]);
}

function eightSegmentDisplay(
  layer: WidgetsLayer,
  offsetX: number,
  digit: Digit
) {
  for (let i = 0; i < digit.length; i++) {
    for (let j = 0; j < digit[i].length; j++) {
      if (digit[i][j] === 1) {
        const box = new RectShape({
          rect: new DOMRect(offsetX, offset.y, size.width, size.height),
          fillColor: "#000000",
          cornerRadius: 5,
        });
        box.rect.x += j * (box.rect.width + padding);
        box.rect.y += i * (box.rect.height + padding);
        layer.addChild(box);
        const boxX = box.rect.x;
        const boxY = box.rect.y;
        box.onUpdate = (time) => {
          box.rect.x = boxX + Math.sin(time / 1000) * 10;
          box.rect.y = boxY + Math.cos(time / 1000) * 10;
        };
      }
    }
  }
}

type Digit = (0 | 1)[][];
