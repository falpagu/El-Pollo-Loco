/**
 * Collectible bottle on the ground. Picked up by the character
 * and increases the bottle supply.
 *
 * @extends DrawableObject
 */
class Bottles extends DrawableObject {

  offset = { top: 10, bottom: 10, left: 20, right: 10 };
  
  /**
   * Image paths of the two bottle variants that are preloaded.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a bottle at the given position.
   *
   * @param {number} x - X position in the level.
   * @param {number} y - Y position in the level.
   */
  constructor(x, y) {
    super();
    this.loadImage("assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 80;
  }
}
