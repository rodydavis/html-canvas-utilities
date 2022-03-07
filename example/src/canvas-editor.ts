import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { CanvasController } from "html-canvas-utilities";
import { addRandomShapes } from "./shapes.js";

@customElement("canvas-editor")
export class CanvasEditor extends LitElement {
  static styles = css`
    canvas {
      --canvas-background-color: #fafafa;
      --canvas-grid-color: #ccc;
      --canvas-selected-color: #f00;
      --canvas-hovered-color: #0f0;
      cursor: pointer;
      user-select: none;
      user-zoom: none;
      /* min-height: 100vh; */
      /* max-height: 100vh; */
      /* min-width: 100vw; */
      /* max-width: 100vw; */
      /* min-height: -webkit-fill-available; */
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
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    addRandomShapes(controller);
    controller.addChild({
      rect: new DOMRect(100, 100, 100, 100),
      draw: (ctx, size) => {
        ctx.fillStyle = "purple";
        ctx.fillRect(0, 0, size.width, size.height);
      },
      children: [
        {
          rect: new DOMRect(25, 25, 50, 50),
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
    controller.clearSelection();
    controller.paint();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
