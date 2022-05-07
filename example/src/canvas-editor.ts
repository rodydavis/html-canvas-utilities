import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import {
  CanvasLayer,
  CanvasTransformer,
  CanvasView,
  InfiniteGrid,
} from "html-canvas-utilities";

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
    const transformer = new CanvasTransformer();
    const controller = new CanvasView({
      canvas,
      plugins: [transformer],
    });
    // controller.addListener(() => {
    //   const { offset, scale } = controller.info;
    //   console.debug(`offset: ${offset.x}, ${offset.y}; scale: ${scale}`);
    // });
    const bgLayer = new InfiniteGrid({
      plugins: [transformer],
    });
    controller.addLayer(bgLayer);

    const layer = new SquareDemo({
      plugins: [transformer],
    });
    controller.addLayer(layer);

    controller.start();

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

class SquareDemo extends CanvasLayer {
  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    const x = Math.sin(timestamp / 1000) * 100;
    const y = Math.cos(timestamp / 1000) * 100;
    const offset = 100;
    ctx.fillStyle = "red";
    ctx.fillRect(x + offset, y + offset, 100, 100);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-editor": CanvasEditor;
  }
}
