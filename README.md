# Farmer Harvest Game — ES6 Modules

This project is a refactor-and-extend of the starter "Farmer Harvest" mini-game.

## What’s implemented

- **Q1. Language Features**
  - Converted anonymous callbacks to **arrow functions** where appropriate (e.g., RAF `tick`, inline UI button handlers).
  - Used **`.bind(this)`** where the callback must be added/removed later (`Input` keyboard listeners, `resize`).
  - In-code comments explain **how `this` is bound** across RAF loop, event listeners, and method references.

- **Q2. Gameplay Features (2+)**
  - Multiple **crop types** with distinct point values (wheat=1, pumpkin=3, apple=5, golden=10).
  - **Difficulty curve** that shortens spawn interval over time; later levels also increase pressure.
  - Bonus: **Moving obstacles (crows)** that patrol and make navigation trickier.

- **Q3. Refactoring**
  - Modularized into ES6 modules: `Game.js`, `Farmer.js`, `Crop.js`, `Obstacle.js`, `Input.js`, `util.js`.
  - JSDoc comments on classes and methods.

- **Graduate Enhancements**
  - **G2. Level System** — three levels, auto-advance upon reaching the goal.
  - **G3. Animation/Sprites** — game supports a 4×4 sprite sheet for the farmer (fallback to a rectangle if missing).
  - **G4. Configurable Difficulty** — levels and crop distribution loaded from **`assets/config.json`**.

> If you need **G1. AI Competitor Farmer**, consider adding a second `FarmerAI` entity that targets nearest crop using A* or greedy nearest-neighbor; update each frame and compare scores.

## Run locally

Because the game loads `assets/config.json` with `fetch()`, run from a local web server:

```bash
cd farmer-harvest-game
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## File structure

```
.
├── index.html
├── style.css
├── assets
│   ├── config.json
│   └── sprites
│       └── farmer.png   # optional sprite sheet (4x4). Provide your own.
└── src
    ├── main.js
    ├── Game.js
    ├── Farmer.js
    ├── Crop.js
    ├── Obstacle.js
    ├── Input.js
    ├── util.js
    └── types.d.ts
```

## Q4 Reflection (short answers)

See `reflection.md` (export to PDF for submission).
"# Farmer-Game" 
