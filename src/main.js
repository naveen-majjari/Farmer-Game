// Entry module: loads config, creates the Game, and wires UI.
// Arrow functions are used where we want lexical `this` from surrounding scope.

import { Game } from "./Game.js";

(async () => {
  // Load difficulty config (levels, crops, spawn, timers).
  const cfg = await fetch("../assets/config.json").then(r => r.json());

  const canvas = document.getElementById("game");
  const ui = {
    start: document.getElementById("btnStart"),
    reset: document.getElementById("btnReset"),
    pause: document.getElementById("btnPause"),
    score: document.getElementById("score"),
    aiScore:document.getElementById("aiscore"),
    time:  document.getElementById("time"),
    goal:  document.getElementById("goal"),
    level: document.getElementById("level"),
    status:document.getElementById("status"),
  };

  const game = new Game(canvas, ui, cfg);

  // Inline click handlers as arrow functions so `this` resolves to lexical scope (not needed here,
  // but demonstrates the pattern compared to bind for removable listeners).
  ui.start.addEventListener("click", () => game.start());
  ui.reset.addEventListener("click", () => game.reset());
  ui.pause.addEventListener("click", () => game.togglePause());

  // Start in menu state with a draw so the canvas isn't blank.
  game.draw(0);
})().catch(err => {
  console.error("Failed to boot:", err);
  const status = document.getElementById("status");
  if (status) status.textContent = "Error loading config.json (serve with a local server).";
});
