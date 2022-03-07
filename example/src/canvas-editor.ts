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
    const canvas = this.canvas;
    const controller = new CanvasController(canvas);
    controller.addListener(() => {
      const { offset, scale } = controller.info;
      console.debug(`offset: ${offset.x}, ${offset.y}; scale: ${scale}`);
    });
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    addRandomShapes(controller);
    controller.clearSelection();
    controller.canvasResize();
    window.addEventListener("canvasResize", () => controller.resize());
    controller.paint();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
