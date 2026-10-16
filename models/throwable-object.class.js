/**
 * Bottle thrown by the character. Flies in the throw direction (left or
 * right) in an arc and is removed by {@link World#checkBottleHits}
 * when it hits an enemy or the end boss.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Collision offsets used to adjust the bottle's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 10, bottom: 10, left: 10, right: 10 };

  /**
   * Whether the bottle has already hit something and should be removed.
   * @type {boolean}
   */
  hasHit = false;

  /**
   * Horizontal throw direction: 1 flies to the right, -1 to the left.
   * @type {number}
   */
  direction = 1;

  /** True when the splash is finished and the bottle can be deleted. */
  removable = false;

  /** Index of the current splash frame. */
  splashFrame = 0;

  IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
  ];

  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  /**
   * Creates a bottle at the given position and throws it immediately.
   *
   * @param {number} x - Start X position in the level.
   * @param {number} y - Start Y position in the level.
   * @param {boolean} [toLeft=false] - True to throw the bottle to the left.
   */
  constructor(x, y, toLeft = false) {
    super().loadImage(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.direction = toLeft ? -1 : 1;
    this.throw();
  }

  /**
   * Launches the bottle: upward speed, gravity, horizontal movement
   * and the animation loop.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      if (this.isGamePaused() || this.isSplashing) return;
      this.x += 10 * this.direction;
      if (this.y >= 350) this.splash();
    }, 25);
    this.animationInterval = setInterval(() => this.animateBottle(), 60);
  }

  /** Rotation while flying, splash once after a hit. */
  animateBottle() {
    if (this.isGamePaused()) return;
    if (!this.isSplashing) {
      this.playAnimation(this.IMAGES_ROTATION);
    } else if (this.splashFrame < this.IMAGES_SPLASH.length) {
      this.img = this.imageCache[this.IMAGES_SPLASH[this.splashFrame]];
      this.splashFrame++;
    } else {
      this.removable = true;
      this.stop();
    }
  }

  /** Stops the flight and starts the splash animation. */
  splash() {
    if (this.isSplashing) return;
    this.isSplashing = true;
    this.hasHit = true;
    this.speedY = 0;
    this.accelartion = 0;
    SoundManager.play("splash");
  }

  /** Clears all intervals of this bottle. */
  stop() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);
  }
}
