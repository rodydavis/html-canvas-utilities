import { Offset } from "../../utils.js";
import { CanvasWidget } from "../widget.js";

export abstract class GroupBase extends CanvasWidget {
  abstract children: CanvasWidget[];
}
