import { CanvasController, DomShape } from "html-canvas-utilities";

export function addDom(controller: CanvasController) {
  const dom = new DomShape({
    rect: new DOMRect(50, 50, 150, 50),
    element: async (rect) => {
      const element = document.createElement("div");
      element.id = "capture";
      element.style.background = "#f5da55";
      element.style.display = "flex";
      element.style.justifyContent = "center";
      element.style.alignItems = "center";
      element.style.width = rect.width + "px";
      element.style.height = rect.height + "px";
      element.innerHTML = ` <div style="color: #000; text-align: center; flex: 1;">Hello world!</div>`;
      return element;
    },
  });
  controller.addChild(dom);
  // TODO: Offline support
  // TODO: Add SSR example with Lit
  const element = document.createElement("mwc-button");
  const wc = new DomShape({
    rect: new DOMRect(250, 20, 100, 36),
    element: async (rect) => {
      element.style.width = rect.width + "px";
      element.style.height = rect.height + "px";
      element.setAttribute("label", "BUTTON");
      element.setAttribute("raised", "");
      return element;
    },
  });
  controller.addChild(wc);
}
