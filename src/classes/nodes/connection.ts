import { Block, CONNECTION_SIZE } from "./block";

export class Connection {
  from?: Block;
  to?: Block;

  connectFrom(from: Block) {
    this.from = from;
  }

  connectTo(to: Block) {
    this.to = to;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { from, to } = this;
    if (!from || !to) {
      return;
    }

    // Get input index (center of the input)
    const outputs = from.outputs;
    const inputIndex = outputs.indexOf(this);
    const fromPos = from.outputPosition(inputIndex, false);

    // Get output index
    const inputs = to.inputs;
    const outputIndex = inputs.indexOf(this);
    const toPos = to.inputPosition(outputIndex, false);

    // Draw line
    const cs = CONNECTION_SIZE;
    ctx.beginPath();
    ctx.moveTo(fromPos.x + cs / 2, fromPos.y + cs / 2);
    ctx.lineTo(toPos.x + cs / 2, toPos.y + cs / 2);
    ctx.stroke();
  }
}
