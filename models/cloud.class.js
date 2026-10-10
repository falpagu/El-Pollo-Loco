/**
 * Cloud in the background of the level.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /**
   * Y position of the cloud in pixels.
   * @type {number}
   */
  y = 50;

  /**
   * Width of the cloud in pixels.
   * @type {number}
   */
  width = 500;

  /**
   * Height of the cloud in pixels.
   * @type {number}
   */
  height = 250;

  /**
   * Creates a cloud with the cloud image and a random X position (0 to 500).
   */
  constructor() {
    super().loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Moves the cloud one step to the left.
   *
   * Note: This runs only once. For continuous movement, call
   * `this.moveLeft()` inside a `setInterval`.
   *
   * @returns {void}
   */
  animate() {
    this.moveLeft();
  }
}
