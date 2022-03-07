// import { Size } from "../../utils.js";
// import { CanvasWidget } from "../widget.js";
// import { GroupBase } from "./base.js";

// export type Flex = "start" | "end" | "center";
// export type FlexMain =
//   | "start"
//   | "end"
//   | "center"
//   | "space-between"
//   | "space-around"
//   | "space-evenly";
// export type FlexDirection = "row" | "column";

// export abstract class FlexBase extends GroupBase {
//   constructor(
//     readonly options: {
//       children: CanvasWidget[];
//       direction: FlexDirection;
//       crossAxisAlignment?: Flex;
//       mainAxisAlignment?: FlexMain;
//     }
//   ) {
//     super();
//   }
//   children = this.options.children;
//   crossAxisAlignment: Flex = this.options.crossAxisAlignment || "center";
//   mainAxisAlignment: FlexMain = this.options.crossAxisAlignment || "center";
//   direction: "row" | "column" = this.options.direction;
// }
