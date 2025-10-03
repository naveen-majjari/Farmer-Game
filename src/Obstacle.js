/**
 * @file Obstacle.js
 * @description Static obstacles and a simple moving Crow hazard that reduces score on hit.
 */

import { aabb } from "./util.js";

export class Obstacle {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  rect() { return { x:this.x, y:this.y, w:this.w, h:this.h }; }
  draw(ctx) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // A simple scarecrow cross
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(this.x + this.w/2 - 2, this.y - 14, 4, 14);
    ctx.fillRect(this.x + this.w/2 - 12, this.y - 6, 24, 3);
  }
}

// Moving obstacle example: Crow
export class Crow {
  constructor(x, y, vx = 90, vy = 0, r = 10) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.r = r;
    this.cooldown = 0;
  }
  rect() { return { x:this.x - this.r, y:this.y - this.r, w:this.r*2, h:this.r*2 }; }
  update(dt, canvas) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // bounce on edges
    if (this.x < this.r || this.x > canvas.width - this.r) this.vx *= -1;
    if (this.y < this.r || this.y > canvas.height - this.r) this.vy *= -1;
    this.cooldown = Math.max(0, this.cooldown - dt);
  }
  draw(ctx) {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }
}
