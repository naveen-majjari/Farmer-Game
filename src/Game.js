/**
 * @file Game.js
 * @description Core game loop, state machine, spawning, collisions, levels, AI competitor, and UI sync.
 */

import { Input } from "./Input.js";
import { Farmer } from "./Farmer.js";
import { FarmerAI } from "./FarmerAI.js";
import { spawnRandomCrop } from "./Crop.js";
import { PowerUp } from "./PowerUp.js";
import { Obstacle, Crow } from "./Obstacle.js";
import { aabb } from "./util.js";

export class Game {
  constructor(canvas, ui, cfg) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ui = ui;
    this.cfg = cfg;

    // --- state ---
    this.state = "MENU"; // MENU | PLAYING | PAUSED | GAME_OVER | WIN
    this.levelIndex = 0;
    this.timeLeft = 0;
    this.goal = 0;
    this.score = 0;

    // entities
    this.input = new Input(this);
    this.farmer = new Farmer(64, 64);
    this.ai = new FarmerAI(700, 400); // AI competitor
    this.aiScore = 0;

    this.crops = [];
    this.obstacles = [];

    // spawn timing
    this._accumSpawn = 0;
    this.spawnEvery = 1.0;
    this.spawnDecay = 0.0;
    this.minSpawnEvery = 0.35;

    // resize uses .bind(this) so we can remove it
    this._onResize = this.onResize.bind(this);
    window.addEventListener("resize", this._onResize);
    this.onResize();

    // RAF loop as arrow => lexical this stays bound to Game
    this._lastTs = 0;
    this.tick = (ts) => {
      const dt = Math.min((ts - this._lastTs) / 1000 || 0, 0.033);
      this._lastTs = ts;
      this.update(dt);
      this.draw(dt);
      requestAnimationFrame(this.tick);
    };
    requestAnimationFrame(this.tick);

    this.syncUI();
  }

  dispose() {
    window.removeEventListener("resize", this._onResize);
    this.input.dispose();
  }

  onResize() {}

  start() {
    if (this.state === "WIN" && this.levelIndex + 1 < this.cfg.levels.length) {
      this.levelIndex++;
    } else {
      this.levelIndex = 0;
      this.score = 0;
    }
    this.loadLevel(this.levelIndex);
    this.state = "PLAYING";
    this.ui.status.textContent = "Playing…";
  }

  reset() {
    this.state = "MENU";
    this.crops.length = 0;
    this.obstacles.length = 0;
    this.timeLeft = 0;
    this.goal = 0;
    this.farmer.reset(64, 64);
    this.aiScore = 0;
    if (this.ai) { this.ai.x = this.canvas.width - 92; this.ai.y = this.canvas.height - 92; }
    this.syncUI();
    this.ui.status.textContent = "Press Start";
  }

  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
      this.ui.status.textContent = "Paused";
    } else if (this.state === "PAUSED") {
      this.state = "PLAYING";
      this.ui.status.textContent = "Playing…";
    }
  }

  loadLevel(idx) {
    const levels = this.cfg.levels;
    const L = levels[idx] ?? levels[levels.length - 1];

    this.goal = L.goal;
    this.timeLeft = L.time;

    this.crops.length = 0;
    this.obstacles.length = 0;
    this._accumSpawn = 0;

    for (const o of (L.obstacles || [])) {
      this.obstacles.push(new Obstacle(o.x, o.y, o.w, o.h));
    }
    for (const c of (L.crows || [])) {
      this.obstacles.push(new Crow(c.x, c.y, c.vx, c.vy, c.radius));
    }

    this.spawnEvery = L.spawnEvery;
    this.spawnDecay = L.spawnDecay ?? 0.0;
    this.minSpawnEvery = L.minSpawnEvery ?? 0.35;

    // reset AI
    this.aiScore = 0;
    if (this.ai) { this.ai.x = this.canvas.width - 92; this.ai.y = this.canvas.height - 92; }

    this.syncUI();
  }

  update(dt) {
    if (this.state !== "PLAYING") { this.syncUI(); return; }

    this.timeLeft -= dt;
    if (this.timeLeft < 0) this.timeLeft = 0;

    this.farmer.update(dt, this.input, this.canvas, this.obstacles);
    if (this.ai && typeof this.ai.update === "function") {
      this.ai.update(dt, this.canvas, this.obstacles, this.crops);
    }

    this._accumSpawn += dt;
    if (this._accumSpawn >= this.spawnEvery) {
      this._accumSpawn = 0;
      this.crops.push(spawnRandomCrop(this.canvas, this.cfg.crops));
      this.spawnEvery = Math.max(this.minSpawnEvery, this.spawnEvery - this.spawnDecay);
    }

    for (const o of this.obstacles) if (o.update) o.update(dt, this.canvas);

    // player crops
    let gained = 0;
    for (const c of this.crops) {
      c.update(dt);
      if (!c.collected && aabb(this.farmer, c)) {
        c.collected = true;
        gained += c.points;
      }
    }
    if (gained > 0) this.score += gained;

    // ai crops
    if (this.ai) {
      for (const c of this.crops) {
        if (!c.collected && aabb(this.ai, c)) {
          c.collected = true;
          this.aiScore += c.points;
        }
      }
    }

    // --- end conditions ---
    if (this.score >= this.goal) {
      this.state = "WIN";
      this.ui.status.textContent = "You Win!";
      this.syncUI();
      return;
    }

    if (this.aiScore >= this.goal) {
      this.state = "GAME_OVER";
      this.ui.status.textContent = "AI Won!";
      this.syncUI();
      return;
    }

    if (this.timeLeft === 0) {
      this.state = "GAME_OVER";
      this.ui.status.textContent = (this.score === 0) ? "Game Over" : "Time's up!";
      this.syncUI();
      return;
    }

    this.crops = this.crops.filter(c => !c.collected);
    this.syncUI();
  }

  syncUI() {
    this.ui.score.textContent   = String(this.score);
    if (this.ui.aiScore) {
      this.ui.aiScore.textContent = String(this.aiScore);
    }
    this.ui.goal.textContent    = String(this.goal);
    this.ui.level.textContent   = String(this.levelIndex + 1);
    this.ui.time.textContent    = this.timeLeft.toFixed(1);
  }

  draw(dt) {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // background: light blue
    ctx.fillStyle = "#87CEFA";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    const TILE = 32;
    ctx.beginPath();
    for (let x = 0; x <= W; x += TILE) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y <= H; y += TILE) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    for (const c of this.crops) c.draw(ctx);
    for (const o of this.obstacles) o.draw(ctx);

    if (this.ai) this.ai.draw(ctx);
    this.farmer.draw(ctx);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(this.stateLabel(), 12, 22);
  }

  stateLabel() {
    switch (this.state) {
      case "MENU": return "Press Start";
      case "PLAYING": return `Playing… (You: ${this.score}, AI: ${this.aiScore})`;
      case "PAUSED": return "Paused";
      case "GAME_OVER": return (this.score === 0 ? "Game Over" : "Time's up!");
      case "WIN": return "You Win!";
    }
    return "";
  }
}
