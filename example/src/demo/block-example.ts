import { CanvasController, Block, Connection } from "html-canvas-utilities";

export class BlockController extends CanvasController {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  init() {
    super.init();
    this.addExample();
  }

  drawContent(ctx: CanvasRenderingContext2D, time: number): void {
    this.drawConnections(ctx);
    super.drawContent(ctx, time);
  }

  drawConnections(ctx: CanvasRenderingContext2D) {
    // Draw connections
    for (const child of this.children) {
      if (child instanceof Block) {
        for (const input of child.inputs) {
          input.draw(ctx);
        }
      }
    }
  }

  addExample() {
    // Three way connection
    const a = new Block({
      offset: {
        x: 20,
        y: 70,
      },
      label: "Block A",
    });
    const b = new Block({
      offset: {
        x: 140,
        y: 50,
      },
      label: "Block B",
    });
    const c = new Block({
      offset: {
        x: 280,
        y: 150,
      },
      label: "Block C",
    });

    const conn1 = new Connection();
    const conn2 = new Connection();
    const conn3 = new Connection();

    a.addOutput(conn1);
    b.addInput(conn1);
    b.addOutput(conn2);
    c.addInput(conn2);
    c.addInput(conn3);
    a.addOutput(conn3);

    this.addChild(a);
    this.addChild(b);
    this.addChild(c);
  }
}
