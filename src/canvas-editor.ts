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
      /* user-zoom: none;
      user-select: none;
      touch-action: none; */
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
    addRandomShapes(controller);
    controller.clearSelection();
    controller.paint();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
