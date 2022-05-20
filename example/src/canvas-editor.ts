import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { CanvasController } from "html-canvas-utilities";
import { addRandomShapes } from "./demo/shapes.js";
import { generateText } from "./demo/segmented-display.js";
import { colorDemo } from "./demo/color.js";
import { addText } from "./demo/text.js";

@customElement("canvas-editor")
export class CanvasEditor extends LitElement {
  static styles = css`
    * {
      --canvas-background-color: #fafafa;
      --canvas-grid-color: #ccc;
      --canvas-selected-color: #f00;
      --canvas-hovered-color: #0f0;
      --canvas-text-color: #000;
      --block-background-color: #eee;
      --block-border-color: rgb(216, 216, 216);
      --block-node-color: rgb(30, 30, 30);
      cursor: pointer;
      user-select: none;
      user-zoom: none;
    }
    @media (prefers-color-scheme: dark) {
      * {
        --canvas-background-color: #333;
        --canvas-grid-color: #666;
        --canvas-selected-color: #bd0303;
        --canvas-hovered-color: #04a104;
        --canvas-text-color: #fff;
        --block-background-color: #444;
        --block-border-color: rgb(216, 216, 216);
        --block-node-color: rgb(30, 30, 30);
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
    controller.init();

    // Add Demos
    generateText(controller);
    colorDemo(controller);
    addRandomShapes(controller);
    addText(controller);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
