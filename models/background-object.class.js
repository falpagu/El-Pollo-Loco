/**
 * Background layer of the level (sky, mountains, ground).
 * Static object that is drawn across the full canvas height.
 *
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * Width of the image in pixels.
   * @type {number}
   */
  width = 719;

  /**
   * Height of the image in pixels (equals the canvas height).
   * @type {number}
   */
  height = 480;

  /**
   * Creates a background object and aligns it to the bottom of the canvas.
   *
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - X position in the level where the image starts.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.y = 480 - this.height;
    this.x = x;
  }
}
