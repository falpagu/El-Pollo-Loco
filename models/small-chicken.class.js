/**
 * Small enemy chicken. Smaller and faster than the normal {@link Chicken}.
 * Walking, animation, pausing and dying are inherited from Chicken.
 *
 * @extends Chicken
 */
class SmallChicken extends Chicken {
  /**
   * Height of the small chicken in pixels.
   * @type {number}
   */
  height = 45;

  /**
   * Width of the small chicken in pixels.
   * @type {number}
   */
  width = 50;

  /**
   * Y position (ground level). Chosen so the feet are on the same line
   * as the normal chicken.
   * @type {number}
   */
  y = 390;

  /**
   * Collision offsets used to adjust the small chicken's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 4, bottom: 3, left: 4, right: 4 };

  /**
   * Name of the sound used for this enemy.
   * @type {string}
   */
  soundName = "smallChicken";

  /**
   * Maximum distance at which the enemy's sound can be heard.
   * @type {number}
   */
  soundDistance = 300;

  /**
   * Image paths of the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Image paths of the dead small chicken.
   * @type {string[]}
   */
  IMAGES_DEAD = ["assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

   /**
   * Creates a small chicken, loads its own images and assigns
   * a random speed (0.3 to 0.8).
   *
   * @param {number} [x=200 + Math.random() * 500] - The starting X position.
   */
  constructor(x = 200 + Math.random() * 500) {
    super(x);
    this.loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.3 + Math.random() * 0.5;
    this.animate();
  }
}
