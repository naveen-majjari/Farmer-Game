/**
 * @file Crop.js
 * @description Crop entities with multiple types and point values. Includes a spawn helper.
 */

import { randInt, aabb } from "./util.js";

export const CROP_TYPES = {
  wheat:  { color:"#facc15", points:1,  size:18 },
  pumpkin:{ color:"#ea580c", points:3,  size:22 },
  apple:  { color:"#dc2626", points:5,  size:18 },
};

export class Crop {
  /**
   * @param {number} x
   * @param {number} y
   * @param {{color:string, points:number, size:number}} type
   */
  constructor(x, y, type) {
    this.x = x; this.y = y;
    this.type = type;
    this.w = type.size; this.h = type.size;
    this.sway = Math.random() * Math.PI * 2;
    this.collected = false;
  }

  rect() { return { x:this.x, y:this.y, w:this.w, h:this.h }; }

  update(dt) {
    this.sway += dt * 4;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.w/2, this.y + this.h/2);
    ctx.rotate(Math.sin(this.sway) * 0.1);
    ctx.fillStyle = this.type.color;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(this.w, this.h)/2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Spawn a crop using weighted distribution from config.crops.distribution
 * @param {HTMLCanvasElement} canvas
 * @param {{distribution:Record<string,number>}} cropCfg
 * @returns {Crop}
 */
export function spawnRandomCrop(canvas, cropCfg) {
  const total = Object.values(cropCfg.distribution).reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  let chosen = "wheat";
  for (const [k, w] of Object.entries(cropCfg.distribution)) {
    if ((r -= w) <= 0) { chosen = k; break; }
  }
  const type = CROP_TYPES[chosen] || CROP_TYPES.wheat;
  const pad = 24;
  const x = randInt(pad, canvas.width - pad - type.size);
  const y = randInt(pad, canvas.height - pad - type.size);
  return new Crop(x, y, type);
}
