# HTML Canvas Utilities

[![Demo](https://github.com/rodydavis/html-canvas-utilities/actions/workflows/ci.yml/badge.svg)](https://github.com/rodydavis/html-canvas-utilities/actions/workflows/ci.yml)
[![Published on npm](https://img.shields.io/npm/v/html-canvas-utilities.svg)](https://www.npmjs.com/package/html-canvas-utilities)

Abstract canvas controller that can take a set of drawable children and render them to the canvas while hooking up events for pan, zoom, move and select.

[Online Demo](https://rodydavis.github.io/html-canvas-utilities/)

- ✅ No Dependencies
- ✅ ES Modules
- ✅ Full Browser Support
- ✅ 100% Typescript

https://user-images.githubusercontent.com/31253215/156279985-b89cc58c-6549-491c-b641-b67fb9a4eae5.mov

## Gestures

- Mouse wheel events
- Keyboard navigation
- Mobile pinch / zoom
- Zoom at cursor
- Mobile tap to select
- Cursor changes
- Theme API

## Theme

Light Theme

```css
--canvas-background-color: #fafafa;
--canvas-grid-color: #ccc;
--canvas-selected-color: #f00;
--canvas-hovered-color: #0f0;
```

Dark Theme

```css
--canvas-background-color: #333;
--canvas-grid-color: #666;
--canvas-selected-color: #bd0303;
--canvas-hovered-color: #04a104;
```

## Example

```js
// Get the canvas
const canvas = document.querySelector('canvas');

// Attach the controller
const controller = new CanvasController(canvas);

// (Optional) Add a listener
controller.addListener(() => {
    const { offset, scale } = controller.info;
    console.debug(`offset: ${offset.x}, ${offset.y}; scale: ${scale}`);
});

// Add a child to control and render
controller.addChild({
    rect: new DOMRect(0, 0, 100, 100),
    draw: (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        ctx.restore();
    },
});

// Add a child with nested children relative to the parent
controller.addChild({
    rect: new DOMRect(100, 100, 100, 100),
    draw: (ctx, size) => {
      ctx.fillStyle = "purple";
      ctx.fillRect(0, 0, size.width, size.height);
    },
    children: [
      {
        rect: new DOMRect(50, 50, 50, 50),
        draw: (ctx, size) => {
          ctx.fillStyle = "yellow";
          ctx.fillRect(0, 0, size.width, size.height);
        },
        children: [
          {
            rect: new DOMRect(12.5, 12.5, 25, 25),
            draw: (ctx, size) => {
              ctx.fillStyle = "magenta";
              ctx.fillRect(0, 0, size.width, size.height);
            },
          },
        ],
      },
    ],
});

// Start the animation loop
controller.paint();
```

### Lit Example

```js
import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { CanvasController } from "./controller";
import { addRandomShapes } from "./shapes";

@customElement("canvas-editor")
export class CanvasEditor extends LitElement {
  static styles = css`
    canvas {
      --canvas-background-color: #fafafa;
      --canvas-grid-color: #ccc;
      --canvas-selected-color: #f00;
      --canvas-hovered-color: #0f0;
      width: 100%;
      height: 100%;
    }
    @media (prefers-color-scheme: dark) {
      canvas {
        --canvas-background-color: #333;
        --canvas-grid-color: #666;
        --canvas-selected-color: #bd0303;
        --canvas-hovered-color: #04a104;
      }
    }
  `;

  @query("#canvas") canvas!: HTMLCanvasElement;

  render() {
    return html` <canvas id="canvas"></canvas> `;
  }

  firstUpdated() {
    const controller = new CanvasController(this.canvas);
    controller.addListener(() => {
      const { offset, scale } = controller.info;
      console.debug(`offset: ${offset.x}, ${offset.y}; scale: ${scale}`);
    });
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", () => resize());
    resize();
    
    controller.addChild({
        rect: new DOMRect(0, 0, 100, 100),
        draw: (ctx: CanvasRenderingContext2D) => {
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, 100, 100);
            ctx.restore();
        },
    });

    controller.clearSelection();
    controller.paint();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}

```
