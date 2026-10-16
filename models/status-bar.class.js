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
 * Calculates the image index based on the current percentage.
 * 100% returns index 0, 80% returns index 1, and so on.
 * 0% returns index 5.
 *
 * @returns {number} Index of the image to display (0 to 5).
 *//
  resolveImageIndex() {
    return 5 - Math.ceil(this.percentage / 20);
  }
}
