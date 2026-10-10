/**
 * Collectible coin. Picked up by the character and increases
 * the coin counter.
 *
 * @extends DrawableObject
 */
class Coins extends DrawableObject {
  /**
   * Collision offsets used to adjust the coin's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 30, bottom: 30, left: 30, right: 30 };

  /**
   * Image paths of the two coin variants that are preloaded.
   * @type {string[]}
   */
  IMAGES_COIN = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
  ];

  /**
   * Creates a coin at the given position.
   *
   * @param {number} x - X position in the level.
   * @param {number} y - Y position in the level.
   */
  constructor(x, y) {
    super();
    this.loadImage("assets/img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
  }
}
