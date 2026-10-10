/**
 * End boss of the level. Stays idle until the character gets close,
 * then walks to the left. Can only be damaged by thrown bottles.
 * The less energy it has, the faster it moves. At 40% energy or less
 * it is enraged: bigger, faster and surrounded by a red glow.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * Collision offsets used to adjust the endboss's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 80, bottom: 20, left: 40, right: 20 };

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
   * Increases with every bottle hit.
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
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
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
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
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
   * Starts two intervals. Both do nothing while the game is paused:
   * 1. Movement to the left (60 times per second), only while the boss
   *    is active, alive and not hurt.
   * 2. Animation (every 200 ms). Priority: dead, hurt, walking.
   *
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      if (this.isGamePaused()) return;
      if (!this.active || this.isDead() || this.isHurt()) return;
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isGamePaused()) return;
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
   * Reduces the boss energy by 20 (minimum 0), stores the time of the hit
   * and increases the speed. At 40% energy the boss grows once
   * and its Y position is adjusted so it stays on the ground.
   *
   * @returns {void}
   */
  hitByBottle() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
    this.speed = 1 + (100 - this.energy) / 40;
    if (this.energy === 40) {
      this.height = 385;
      this.width = 280;
      this.y = 65;
    }
  }

  /**
   * Whether the boss is in rage mode (40% energy or less, still alive).
   *
   * @returns {boolean} True if the boss is enraged.
   */
  isEnraged() {
    return this.energy <= 40 && !this.isDead();
  }

  /**
   * Draws the boss. In rage mode a red glow is added around it.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D drawing context of the canvas.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isEnraged()) return super.draw(ctx);
    ctx.save();
    ctx.shadowColor = "red";
    ctx.shadowBlur = 35;
    super.draw(ctx);
    ctx.restore();
  }
}
