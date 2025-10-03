// PowerUp.js
export class PowerUp {
  constructor(x, y, kind = "speed") {
    this.x = x; this.y = y; this.w = 20; this.h = 20;
    this.kind = kind; // "speed" | "scythe"
    this.collected = false;
  }
  draw(ctx) {
    if (this.collected) return;
    if (this.kind === "speed") {
      ctx.fillStyle = "#00c8ff";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(this.x+12, this.y+4);
      ctx.lineTo(this.x+8,  this.y+12);
      ctx.lineTo(this.x+14, this.y+12);
      ctx.lineTo(this.x+10, this.y+20);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle = "#333";
      ctx.beginPath();
      ctx.arc(this.x+10, this.y+10, 8, 0.2*Math.PI, 1.4*Math.PI);
      ctx.stroke();
    }
  }
}
