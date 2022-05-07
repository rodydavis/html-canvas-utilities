import { CanvasLayer, CanvasView } from "html-canvas-utilities";

export function gameDemo(canvas: HTMLCanvasElement) {
  const controller = new CanvasView({
    canvas,
  });
  // Create parallax effect on timestamp and offset

  // Static blue sky background
  controller.addLayer(new Sky());

  // Clouds
  controller.addLayer(new Clouds());

  // Mountains
  controller.addLayer(new Mountains());

  controller.start();
}

class Sky extends CanvasLayer {
  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

class Clouds extends CanvasLayer {
  clouds: Cloud[] = [];

  start(ctx: CanvasRenderingContext2D): void {
    const numClouds = Math.floor(Math.random() * 10) + 1;
    const canvas = ctx.canvas;
    for (let i = 0; i < numClouds; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 100 + 50;
      const cloud = { x, y, size };
      this.clouds.push(cloud);
    }
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    for (const cloud of this.clouds) {
      const { x, y, size } = cloud;
      // Animate from left to right
      const dx = x + Math.sin(timestamp / 10000) * 100;
      ctx.fillStyle = "white";
      ctx.fillRect(dx, y, size, size);
    }
  }
}

interface Cloud {
  x: number;
  y: number;
  size: number;
}

class Mountains extends CanvasLayer {
  mountains: Mountain[] = [];

  start(ctx: CanvasRenderingContext2D): void {
    const numMountains = Math.floor(Math.random() * 10) + 1;
    const canvas = ctx.canvas;
    for (let i = 0; i < numMountains; i++) {
      const x = Math.random() * canvas.width;
      const height = Math.random() * canvas.height;
      const mountain = { x, height };
      this.mountains.push(mountain);
    }
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    super.draw(ctx, timestamp);
    for (const mountain of this.mountains) {
      const { x, height } = mountain;
      // Animate from left to right
      const dx = x + Math.sin(timestamp / 100000) * 100;
      // Draw jagged mountains from bottom to top
      ctx.fillStyle = "brown";
      ctx.fillRect(dx, ctx.canvas.height - height, 100, height);
    }
  }
}

interface Mountain {
  x: number;
  height: number;
}
