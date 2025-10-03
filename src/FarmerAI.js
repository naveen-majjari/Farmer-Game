/**
 * @file FarmerAI.js
 * @description Simple AI farmer that chases the nearest crop.
 */
import { aabb } from "./util.js";

export class FarmerAI {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 28; this.h = 28;
    this.speed = 110; // a touch slower than player for fairness
  }

  rect() { return { x:this.x, y:this.y, w:this.w, h:this.h }; }

  /**
   * Move toward the nearest uncollected crop; naive obstacle handling (revert on collision).
   */
  update(dt, canvas, obstacles, crops) {
    // pick nearest uncollected crop
    let target = null, bestD = Infinity;
    for (const c of crops) {
      if (c.collected) continue;
      const dx = (c.x + c.w/2) - (this.x + this.w/2);
      const dy = (c.y + c.h/2) - (this.y + this.h/2);
      const d2 = dx*dx + dy*dy;
      if (d2 < bestD) { bestD = d2; target = {dx, dy}; }
    }

    let vx = 0, vy = 0;
    if (target) {
      const len = Math.hypot(target.dx, target.dy) || 1;
      vx = (target.dx / len) * this.speed;
      vy = (target.dy / len) * this.speed;
    }

    const ox = this.x, oy = this.y;
    this.x += vx * dt; this.y += vy * dt;

    // clamp
    this.x = Math.min(Math.max(this.x, 0), canvas.width - this.w);
    this.y = Math.min(Math.max(this.y, 0), canvas.height - this.h);

    // bump into obstacles? revert
    for (const o of obstacles) {
      if (aabb(this.rect(), o.rect())) { this.x = ox; this.y = oy; break; }
    }
  }

  draw(ctx) {
    // Distinct look from player
    ctx.fillStyle = "#1E90FF"; // DodgerBlue
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}
