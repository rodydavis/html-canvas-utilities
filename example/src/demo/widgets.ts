import {
  CanvasTransformer,
  CanvasView,
  InfiniteGrid,
  WidgetsLayer,
} from "html-canvas-utilities";
import { colorDemo } from "./color";
import { addDom } from "./dom";
import { displayDemo } from "./segmented-display";
import { addRandomShapes } from "./shapes";

export function widgetsDemo(canvas: HTMLCanvasElement) {
  const transformer = new CanvasTransformer();
  const controller = new CanvasView({
    canvas,
    plugins: [transformer],
  });

  const bgLayer = new InfiniteGrid({
    plugins: [transformer],
  });
  controller.addLayer(bgLayer);

  const layer = new WidgetsLayer({
    plugins: [transformer],
  });
  displayDemo(layer);
  addRandomShapes(controller, layer);
  colorDemo(layer);
  addDom(layer);
  controller.addLayer(layer);

  controller.start();
}
