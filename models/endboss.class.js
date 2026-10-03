/**
 * End boss of the level. Stays idle until the character gets close,
 * then walks to the left. Can only be damaged by thrown bottles.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * Height of the boss in pixels.
   * @type {number}
   */
  height = 400;

  /**
   * Width of the boss in pixels.
   * @type {number}
   */
  width = 250;

  /**
   * Y position of the boss in pixels.
   * @type {number}
   */
  y = 50;

  /**
   * Movement speed in pixels per tick (60 ticks per second).
   * @type {number}
   */
  speed = 1;

  /**
   * Whether the boss is active (walking). Set to true by
   * {@link World#checkEndbossActivation} when the character gets close.
   * @type {boolean}
   */
  active = false;

  /**
   * Image paths of the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png"
  ];

  /**
   * Image paths of the animation after being hit.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Image paths of the death animation (played once).
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png"
  ];

  /**
   * Creates the boss, loads all images, sets the start position
   * and starts the animation loops.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 750;
    this.animate();
  }


  /**
   * Starts two intervals:
   * 1. Movement to the left (60 times per second), only while the boss
   *    is active, alive and not hurt.
   * 2. Animation (every 200 ms). Priority: dead, hurt, walking.
   *
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      if (!this.active || this.isDead() || this.isHurt()) return;
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playDeadAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.active) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  
  /**
   * Reduces the boss energy by 20 (minimum 0) and stores the time of the hit.
   *
   * @returns {void}
   */
  hitByBottle() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
  }
}