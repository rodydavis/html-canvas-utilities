import html2canvas from "html2canvas";
import { ImageOptions, ImageShape } from "./image.js";

export type ElementBuilder = (rect: DOMRect) => Promise<HTMLElement>;

export interface DomOptions extends ImageOptions {
  element: ElementBuilder;
}

export class DomShape extends ImageShape {
  constructor(options: DomOptions) {
    super(options);
    this.loadElement(options.element);
  }

  element: HTMLElement = document.createElement("main");

  async loadElement(builder: ElementBuilder) {
    const element = await builder(this.rect);
    document.body.appendChild(element);
    // TODO: Wait for element to be loaded
    await new Promise((resolve) => {
      document.addEventListener("DOMContentLoaded", resolve);
      //setTimeout(resolve, 0);
    });
    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: true,
      width: this.rect.width,
      height: this.rect.height,
      backgroundColor: this.fillColor ?? "transparent",
    });
    document.body.removeChild(element);
    this.loaded = false;
    this.src = canvas.toDataURL();
  }
}
