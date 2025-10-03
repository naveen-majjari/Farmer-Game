/**
 * @file Farmer.js
 * @description Player-controlled farmer.
 */
import { aabb } from "./util.js";

export class Farmer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.speed = 120;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
  }

  update(dt, input, canvas, obstacles) {
    let vx = 0, vy = 0;
    if (input.keys.has("ArrowUp") || input.keys.has("w")) vy -= 1;
    if (input.keys.has("ArrowDown") || input.keys.has("s")) vy += 1;
    if (input.keys.has("ArrowLeft") || input.keys.has("a")) vx -= 1;
    if (input.keys.has("ArrowRight") || input.keys.has("d")) vx += 1;

    const len = Math.hypot(vx, vy);
    if (len > 0) { vx /= len; vy /= len; }

    const oldX = this.x, oldY = this.y;
    this.x += vx * this.speed * dt;
    this.y += vy * this.speed * dt;

    // clamp to canvas
    this.x = Math.max(0, Math.min(this.x, canvas.width - this.w));
    this.y = Math.max(0, Math.min(this.y, canvas.height - this.h));

    // collision with obstacles
    for (const o of obstacles) {
      if (aabb(this, o)) {
        this.x = oldX;
        this.y = oldY;
      }
    }
  }

  overlaps(ent) {
    return aabb(this, ent);
  }

  draw(ctx) {
    // Body: bright orange-red
    ctx.fillStyle = "#FF4500"; // orange-red
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // Outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Hat: gold strip
    ctx.fillStyle = "#FFD700"; // gold
    ctx.fillRect(this.x + 6, this.y - 6, this.w - 12, 6);
  }
}
