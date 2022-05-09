import { BoxBase } from "html-canvas-utilities";
import {
  ArrowShape,
  WidgetsLayer,
  CanvasView,
  EllipseShape,
  ImageShape,
  LineBase,
  PolygonShape,
  RectShape,
  StackGroup,
  StarShape,
  Frame,
} from "html-canvas-utilities";

export function addRandomShapes(controller: CanvasView, layer: WidgetsLayer) {
  // Add some shapes
  const shapes = ["circle", "rect", "star", "polygon", "line", "arrow"];
  for (let i = 0; i < 20; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const { x, y } = {
      x: Math.random() * controller.canvas.width,
      y: Math.random() * controller.canvas.height,
    };
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    if (shape === "rect") {
      layer.addChild(
        new RectShape({
          rect: new DOMRect(x, y, 100, 100),
          fillColor: color,
          cornerRadius: 5,
        })
      );
    }
    if (shape === "circle") {
      layer.addChild(
        new EllipseShape({
          rect: new DOMRect(x, y, 100, 100),
          fillColor: color,
        })
      );
    }
    if (shape === "star") {
      layer.addChild(
        new StarShape({
          rect: new DOMRect(x, y, 100, 100),
          fillColor: color,
        })
      );
    }
    if (shape === "polygon") {
      layer.addChild(
        new PolygonShape({
          rect: new DOMRect(x, y, 100, 100),
          fillColor: color,
          pointCount: 9,
        })
      );
    }
    if (shape === "line") {
      layer.addChild(
        new LineBase({
          rect: new DOMRect(x, y, 100, 1),
          strokeColor: color,
        })
      );
    }
    if (shape === "arrow") {
      layer.addChild(
        new ArrowShape({
          rect: new DOMRect(x, y, 100, 1),
          strokeColor: color,
          fillColor: color,
          endArrow: "triangle-arrow",
        })
      );
    }
  }
  // Add random images
  for (let i = 0; i < 5; i++) {
    const { x, y } = {
      x: Math.random() * controller.canvas.width,
      y: Math.random() * controller.canvas.height,
    };
    layer.addChild(
      new ImageShape({
        rect: new DOMRect(x, y, 100, 100),
        image: `https://picsum.photos/seed/seed-${i + 1}/300/300`,
      })
    );
  }

  // Add groups
  const { x, y } = {
    x: Math.random() * controller.canvas.width,
    y: Math.random() * controller.canvas.height,
  };
  layer.addChild(
    new StackGroup({
      clip: false,
      rect: new DOMRect(x, y, 100, 100),
      children: [
        new RectShape({
          rect: new DOMRect(0, 0, 100, 100),
          fillColor: "purple",
          cornerRadius: 5,
        }),
        new RectShape({
          rect: new DOMRect(5, 5, 100, 100),
          fillColor: "blue",
          cornerRadius: 5,
        }),
        new RectShape({
          rect: new DOMRect(10, 10, 100, 100),
          fillColor: "yellow",
          cornerRadius: 5,
        }),
      ],
    })
  );

  // Add flex
  layer.addChild(
    new BoxBase({
      rect: new DOMRect(1000, 1000, 100, 100),
      fillColor: "gray",
      padding: 10,
      child: new RectShape({
        rect: new DOMRect(0, 0, 100, 100),
        fillColor: "purple",
        cornerRadius: 5,
      }),
    })
  );
  layer.addChild(
    new Frame({
      label: "Frame",
      rect: new DOMRect(600, 600, 100, 100),
      fillColor: "gray",
      padding: 10,
      child: new RectShape({
        rect: new DOMRect(0, 0, 100, 100),
        fillColor: "purple",
        cornerRadius: 5,
      }),
    })
  );
}
