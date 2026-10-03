/**
 * Bottle thrown by the character. Flies to the right in an arc
 * and is removed by {@link World#checkBottleHits} when it hits an enemy.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Creates a bottle at the given position and throws it immediately.
   *
   * @param {number} x - Start X position in the level.
   * @param {number} y - Start Y position in the level.
   */
  constructor(x, y) {
    super().loadImage(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
  }

  /**
   * Launches the bottle: sets an upward speed, starts gravity and moves
   * the bottle 10 pixels to the right every 25 ms.
   *
   * @returns {void}
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
  }
}
