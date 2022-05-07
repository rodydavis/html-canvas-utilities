import { pxSize } from "../utils";

export class StageController {
  constructor(
    readonly canvas: HTMLCanvasElement = document.createElement("canvas")
  ) {
    // Listen for resize events
    window.addEventListener("resize", this.resize.bind(this), false);

    this.animate(0);
  }

  resize() {
    const style = getComputedStyle(this.canvas);
    const width = pxSize(style.width) || window.innerWidth;
    const height = pxSize(style.height) || window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  animate(timestamp: number) {
    this.draw(timestamp);
    requestAnimationFrame(this.animate.bind(this));
  }

  draw(timestamp: number) {}
}
