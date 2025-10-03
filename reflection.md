# Reflection — Arrow Functions vs `bind(this)` and Future Work

**(a) Example where an arrow function preserved the correct `this`:**  
In `Game` we implement the RAF loop as:

```js
this.tick = (ts) => {
  // uses `this` to read/update state, then schedules itself
  this.update(dt);
  this.draw(dt);
  requestAnimationFrame(this.tick);
};
```

Here we pass `this.tick` to `requestAnimationFrame`. Because `tick` is an **arrow function**, its `this` is **lexically bound** to the `Game` instance that created it. We do not need `.bind(this)`, and every RAF call runs with the correct `this`.

**(b) Example where `.bind(this)` is more appropriate than an arrow function (and why):**  
In `Input`, we add/remove keyboard listeners:

```js
this._onKeyDown = this.onKeyDown.bind(this);
this._onKeyUp   = this.onKeyUp.bind(this);
window.addEventListener("keydown", this._onKeyDown);
window.addEventListener("keyup", this._onKeyUp);
...
window.removeEventListener("keydown", this._onKeyDown);
window.removeEventListener("keyup", this._onKeyUp);
```

We use `.bind(this)` **once**, store the bound functions, and later pass the **exact same references** to `removeEventListener`. If we used fresh inline arrows for `addEventListener`, we wouldn’t have a stable reference to remove, causing leaks and duplicate handlers.

**(c) One more week — biggest improvement I’d implement:**  
I would add an **AI competitor farmer** (G1). The AI would pick targets using a heuristic (nearest crop; break ties by points/rarity), pathfind around obstacles (A* on a grid), and have slight speed variations per level. This adds tension and strategic choices (e.g., whether to sprint for golden crops or farm safe wheat clusters), and it meaningfully exercises modular design and performance profiling.
