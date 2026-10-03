/**
 * Status bar (health, coins, bottles, end boss) drawn on the canvas.
 * Shows one of six images depending on the current percentage.
 *
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /**
   * Current fill level in percent (0 to 100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a status bar, preloads its images and shows the start level.
   *
   * @param {string[]} images - Image paths ordered from 100% down to 0%
   *   (e.g. {@link IMAGES_HEALTH}).
   * @param {number} x - X position on the canvas.
   * @param {number} y - Y position on the canvas.
   * @param {number} [startPercentage=100] - Initial fill level (0 to 100).
   */
  constructor(images, x, y, startPercentage = 100) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 250;
    this.height = 60;
    this.setPercentage(startPercentage);
  }


  /**
   * Sets the fill level and switches to the matching image.
   *
   * @param {number} percentage - New fill level (0 to 100, in steps of 20).
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  
  /**
   * Maps the current percentage to an index in the image array.
   * 100 returns 0, 80 returns 1, and so on down to 20 returning 4.
   * Every other value (including 0) returns 5.
   *
   * @returns {number} Index of the image to display (0 to 5).
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 0;
    } else if (this.percentage == 80) {
      return 1;
    } else if (this.percentage == 60) {
      return 2;
    } else if (this.percentage == 40) {
      return 3;
    } else if (this.percentage == 20) {
      return 4;
    } else {
      return 5;
    }
  }
}