/**
 * Normal enemy chicken. Walks to the left at a random speed and can be
 * defeated by jumping on it or hitting it with a bottle.
 *
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  /**
   * Height of the chicken in pixels.
   * @type {number}
   */
  height = 55;

  /**
   * Width of the chicken in pixels.
   * @type {number}
   */
  width = 70;

  /**
   * Y position (ground level).
   * @type {number}
   */
  y = 380;

  /**
   * Collision offsets used to adjust the chicken's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 5, bottom: 5, left: 5, right: 5 };

  /**
   * Image paths of the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Image paths of the dead chicken.
   * @type {string[]}
   */
  IMAGES_DEAD = ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a chicken, loads its images, assigns its position and random
   * speed, and starts the animation.
   * @param {number} [x=200 + Math.random() * 500] - The starting X position.
   * */
  constructor(x = 200 + Math.random() * 500) {
    super();
    this.loadImage(
      "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.35;
    this.animate();
  }

  /**
   * Kills the chicken: sets its energy to 0 and shows the dead image.
   * A dead chicken stops moving and cannot hurt the character.
   *
   * @returns {void}
   */
  die() {
    this.energy = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
  }

  /**
   * Starts two intervals. Both do nothing while the game is paused
   * or the chicken is dead:
   * 1. Movement to the left (60 times per second).
   * 2. Walking animation and chicken sound (every 200 ms).
   *
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      if (this.isGamePaused() || this.isDead()) return;
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isGamePaused() || this.isDead()) return;
      this.playAnimation(this.IMAGES_WALKING);
      SoundManager.sounds.chicken.play();
      SoundManager.sounds.chicken.volume = 0.01;
    }, 200);
  }
}
