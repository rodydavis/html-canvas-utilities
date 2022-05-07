import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { canvasDemo } from "./demo/canvas";
import { gameDemo } from "./demo/game";

@customElement("canvas-editor")
export class CanvasEditor extends LitElement {
  static styles = css`
    * {
      --canvas-background-color: #fafafa;
      --canvas-grid-color: #ccc;
      --canvas-selected-color: #f00;
      --canvas-hovered-color: #0f0;
      --canvas-text-color: #000;
      cursor: pointer;
      user-select: none;
      user-zoom: none;
    }
    #canvas {
      width: 100%;
      height: 100%;
    }
    @media (prefers-color-scheme: dark) {
      * {
        --canvas-background-color: #333;
        --canvas-grid-color: #666;
        --canvas-selected-color: #bd0303;
        --canvas-hovered-color: #04a104;
        --canvas-text-color: #fff;
      }
    }
  `;

  @query("#canvas") canvas!: HTMLCanvasElement;

  render() {
    return html` <canvas id="canvas"></canvas> `;
  }

  firstUpdated() {
    const canvas = this.canvas;
    gameDemo(canvas);
    // Wait 3 seconds and stop
    // setTimeout(() => controller.stop(), 3000);

    // Add Demos
    // generateText(controller);
    // colorDemo(controller);
    // addRandomShapes(controller);
    // addText(controller);
    // addDom(controller);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
