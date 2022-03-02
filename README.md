# HTML Canvas Utilities

[![Demo](https://github.com/rodydavis/html-canvas-utilities/actions/workflows/ci.yml/badge.svg)](https://github.com/rodydavis/html-canvas-utilities/actions/workflows/ci.yml)

Abstract canvas controller that can take a set of drawable children and render them to the canvas while hooking up events for pan, zoom, move and select.

![Demo](https://rodydavis.github.io/html-canvas-utilities/)

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
--canvas-controller-background-color: #fafafa;
--canvas-controller-grid-color: #ccc;
--canvas-controller-selected-color: #f00;
--canvas-controller-hovered-color: #0f0;
```

Dark Theme

```css
--canvas-controller-background-color: #333;
--canvas-controller-grid-color: #666;
--canvas-controller-selected-color: #bd0303;
--canvas-controller-hovered-color: #04a104;
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
      --canvas-controller-background-color: #fafafa;
      --canvas-controller-grid-color: #ccc;
      --canvas-controller-selected-color: #f00;
      --canvas-controller-hovered-color: #0f0;
      width: 100%;
      height: 100%;
    }
    @media (prefers-color-scheme: dark) {
      canvas {
        --canvas-controller-background-color: #333;
        --canvas-controller-grid-color: #666;
        --canvas-controller-selected-color: #bd0303;
        --canvas-controller-hovered-color: #04a104;
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
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
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