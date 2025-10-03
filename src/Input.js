/**
 * @file Input.js
 * @description Keyboard input. Uses .bind(this) so listeners can be removed in dispose().
 */

export class Input {
  /**
   * @param {*} game
   */
  constructor(game) {
    this.game = game;
    this.keys = new Set();

    // Bind handlers once so add/remove use the same reference.
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onKeyUp   = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  dispose() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }

  onKeyDown(e) {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
    this.keys.add(e.key);
    if (e.key.toLowerCase() === "p") this.game.togglePause();
  }

  onKeyUp(e) {
    this.keys.delete(e.key);
  }

  isDownAny(arr) {
    for (const k of arr) if (this.keys.has(k)) return true;
    return false;
  }
}
