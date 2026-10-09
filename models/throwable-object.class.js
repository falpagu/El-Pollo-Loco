/**
 * Bottle thrown by the character. Flies in the throw direction (left or
 * right) in an arc and is removed by {@link World#checkBottleHits}
 * when it hits an enemy or the end boss.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {

  /**
   * Whether the bottle has already hit something and should be removed.
   * @type {boolean}
   */
  hasHit = false;

  /**
  * Horizontal throw direction: 1 flies to the right, -1 to the left.
  * @type {number}
  */
  direction = 1;


  /**
   * Creates a bottle at the given position and throws it immediately.
   *
   * @param {number} x - Start X position in the level.
   * @param {number} y - Start Y position in the level.
   * @param {boolean} [toLeft=false] - True to throw the bottle to the left.
   */
  constructor(x, y, toLeft = false) {
    super().loadImage(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.direction = toLeft ? -1 : 1;
    this.throw();
  }

   /**
   * Launches the bottle: sets an upward speed, starts gravity and moves
   * the bottle 10 pixels per tick (every 25 ms) in the throw direction.
   * Skipped while the game is paused.
   *
   * @returns {void}
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      if(this.isGamePaused()) return;
      this.x += 10 * this.direction;
    }, 25);
  }
}
