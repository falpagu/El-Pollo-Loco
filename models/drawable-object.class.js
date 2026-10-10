/**
 * Base class for all objects that are drawn on the canvas.
 * Handles image loading, caching and drawing.
 */
class DrawableObject {
  /**
   * Image that is currently drawn.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * Cache of preloaded images, with the image path as key.
   * @type {Object<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * Index of the current frame in an animation.
   * @type {number}
   */
  currentImage = 0;

  /**
   * X position on the canvas or in the level.
   * @type {number}
   */
  x = 120;

  /**
   * Y position on the canvas or in the level.
   * @type {number}
   */
  y = 280;

  /**
   * Height of the object in pixels.
   * @type {number}
   */
  height = 150;

  /**
   * Width of the object in pixels.
   * @type {number}
   */
  width = 100;

  /**
   * Transparent border of the image in pixels. The real hitbox is the
   * image rectangle minus these values.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Loads a single image and sets it as the current image.
   *
   * @param {string} path - Path to the image file.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image onto the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context of the canvas.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws the image frame (blue) and real hitbox (red) for debugging.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
   * @returns {void}
   */
  drawFrame(ctx) {
    const o = this.offset;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.rect(
      this.x + o.left,
      this.y + o.top,
      this.width - o.left - o.right,
      this.height - o.top - o.bottom,
    );
    ctx.stroke();
  }

  /**
   * Preloads multiple images into {@link DrawableObject#imageCache}
   * so they can be used for animations.
   *
   * @param {string[]} arr - List of image paths.
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
