import { CanvasWidget } from "../widget.js";

export interface GroupOptions {
  children: CanvasWidget[];
}

export abstract class GroupBase extends CanvasWidget {
  constructor(options: GroupOptions) {
    super();
    this.children = options.children;
  }

  private _children: CanvasWidget[];
  get children(): CanvasWidget[] {
    return this._children;
  }
  set children(value: CanvasWidget[]) {
    this._children = value;
    this.notifyListeners();
  }
}
