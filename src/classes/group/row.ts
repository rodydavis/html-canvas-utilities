// import { Size } from "../../utils.js";
// import { CanvasWidget } from "../widget.js";
// import { FlexBase, Flex, FlexMain } from "./flex.js";

// interface RowOptions {
//   children: CanvasWidget[];
//   crossAxisAlignment?: Flex;
//   mainAxisAlignment?: FlexMain;
// }

// export class RowBase extends FlexBase {
//   constructor(options: RowOptions) {
//     super({ ...options, direction: "row" });
//     this.rect = getRect(options);
//   }

//   rect: DOMRect;

//   draw(ctx: CanvasRenderingContext2D, size: Size, parent?: Size): void {
//     const { mainAxisAlignment, crossAxisAlignment } = this;
//     if (parent === undefined) {
//       throw new Error("parent is undefined");
//     }
//     ctx.strokeStyle = "yellow";
//     ctx.strokeRect(0, 0, parent.width, parent.height);
//     let x = 0;
//     let y = 0;
//     let width = 0;
//     let height = 0;
//     if (
//       mainAxisAlignment === "space-around" ||
//       mainAxisAlignment === "space-between" ||
//       mainAxisAlignment === "space-evenly"
//     ) {
//       width = parent.width;
//       height = parent.height;
//     } else {
//       for (const child of this.children) {
//         width += child.rect.width;
//         height = Math.max(height, child.rect.height);
//       }
//     }
//     if (mainAxisAlignment === "center") {
//       x = (parent.width - width) / 2;
//     }
//     if (mainAxisAlignment === "end") {
//       x = parent.width - width;
//     }
//     if (mainAxisAlignment === "start") {
//       x = 0;
//     }
//     if (crossAxisAlignment === "center") {
//       y = (parent.height - height) / 2;
//     }
//     if (crossAxisAlignment === "end") {
//       y = parent.height - height;
//     }
//     if (crossAxisAlignment === "start") {
//       y = 0;
//     }
//     for (const child of this.children) {
//       ctx.translate(x, y);
//       child.draw(ctx, child.rect, parent);
//       x += child.rect.width;
//       ctx.translate(-x, -y);
//     }
//   }
// }

// function getRect(options: RowOptions): DOMRect {
//   if (
//     options.mainAxisAlignment === "start" ||
//     options.mainAxisAlignment === "end" ||
//     options.mainAxisAlignment === "center"
//   ) {
//     let width = 0;
//     let height = 0;
//     for (const child of options.children) {
//       const childRect = child.rect;
//       width += childRect.width;
//       height = Math.max(height, childRect.height);
//     }
//     return new DOMRect(0, 0, width, height);
//   }
//   return new DOMRect(0, 0, 0, 0);
// }
