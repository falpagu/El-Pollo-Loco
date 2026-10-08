/**
 * Base class for all objects that can move, fall, collide, take damage
 * and play animations. Extends {@link DrawableObject}.
 *
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * Horizontal movement speed in pixels per tick.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Whether the object faces left. If true, the image is mirrored when drawn.
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Vertical speed. Positive values move the object up, negative values down.
   * @type {number}
   */
  speedY = 0;

  /**
   * Gravity: amount by which {@link MovableObject#speedY} decreases per tick.
   * (The property name contains a typo, but it is used consistently.)
   * @type {number}
   */
  accelartion = 2.5;

  /**
   * Remaining energy (0 to 100). At 0 the object is dead.
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp (ms) of the last hit. Used by {@link MovableObject#isHurt}.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Index of the next frame of the death animation.
   * @type {number}
   */
  deadFrame = 0;


    /**
 * Checks whether the game is currently paused.
 *
 * @returns {boolean} True if the world is paused.
 */
isGamePaused() {
  return typeof world !== "undefined" && !!world && world.isPaused;
}


/**
 * Starts the gravity loop (25 times per second). Skipped while paused.
 *
 * @returns {void}
 */
  applyGravity() {
    setInterval(() => {
      if(this.isGamePaused()) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.accelartion;
      }
    }, 1000 / 25);
  }


  /**
   * Checks whether the object is above the ground.
   * Thrown objects always count as above ground.
   *
   * @returns {boolean} True if the object is above the ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }


  /**
   * Checks whether this object overlaps another one (rectangle collision).
   *
   * @param {MovableObject|DrawableObject} movable - The other object.
   * @returns {boolean} True if the two rectangles overlap.
   */
  // isColliding(movable) {
  //   return (
  //     this.x + this.width > movable.x &&
  //     this.x < movable.x + movable.width &&
  //     this.y + this.height > movable.y &&
  //     this.y < movable.y + movable.height
  //   );
  // }

isColliding(mo, offset = 0) {
  return (
    this.x + this.width - offset > mo.x &&
    this.y + this.height - offset > mo.y &&
    this.x + offset < mo.x + mo.width &&
    this.y + offset < mo.y + mo.height
  );
}
  /**
   * Reduces energy by 20 (minimum 0). The hit time is stored only
   * if the object is still alive afterwards.
   *
   * @returns {void}
   */
  hit(damage = 20) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }


  /**
   * Checks whether the last hit was less than one second ago.
   *
   * @returns {boolean} True if the object is currently in the hurt phase.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }


  /**
   * Checks whether the object has no energy left.
   *
   * @returns {boolean} True if energy is 0.
   */
  isDead() {
    return this.energy == 0;
  }


  /**
   * Plays an animation in a loop by cycling through the given images.
   * Call once per animation tick.
   *
   * @param {string[]} images - Image paths (must be preloaded via `loadImages`).
   * @returns {void}
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }


  /**
   * Moves the object to the right by {@link MovableObject#speed}.
   *
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }


  /**
   * Moves the object to the left by {@link MovableObject#speed}
   * and mirrors its image.
   *
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }


  /**
   * Makes the object jump by setting an upward speed.
   *
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
  }

  
  /**
   * Plays the death animation once and stays on the last frame.
   * Uses the `IMAGES_DEAD` array of the subclass.
   *
   * @returns {void}
   */
  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
      this.deadFrame++;
    }
  }
}