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
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Image paths of the alert animation.
   * @type {string[]}
   */
  IMAGES_ALERT = [
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
   * Image paths of the attack animation.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
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
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
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
      if (typeof world === "undefined" || !world || !world.character) return;

      const character = world.character;
      const isTouchingCharacter = this.isColliding(character);
      if (isTouchingCharacter) {
        return;
      }
      this.moveLeft();
      this.otherDirection = false;
      this.playWalkSound();
    }, 1000 / 60);

    setInterval(() => {
      if (this.isGamePaused()) return;
      if (this.isDead()) {
        this.playDeadAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isTouchingCharacter()) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.active) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 200);
  }

  /**
   * Checks whether the boss is touching the living character.
   *
   * @returns {boolean} True if the boss touches the living character.
   */
  isTouchingCharacter() {
    if (typeof world === "undefined" || !world || !world.character)
      return false;
    return this.isColliding(world.character) && !world.character.isDead();
  }

  /**
   * Plays the walking sound as a loop if it is not already playing.
   *
   * @returns {void}
   */
  playWalkSound() {
    if (SoundManager.sounds.bossWalk.paused) SoundManager.play("bossWalk");
  }

  /**
   * Stops the walking sound and resets it to the beginning.
   *
   * @returns {void}
   */
  stopWalkSound() {
    const sound = SoundManager.sounds.bossWalk;
    sound.pause();
    sound.currentTime = 0;
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
    this.speed = 2 + (100 - this.energy) / 20;
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
