/**
 * Player character Pepe. Controlled via keyboard, can jump,
 * take damage and die.
 *
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Height of the character in pixels.
   * @type {number}
   */
  height = 250;

  /**
   * Start Y position. Equals the ground level, so the character
   * does not fall from above when the game starts.
   * @type {number}
   */
  y = 200;

  /**
   * Movement speed in pixels per tick (60 ticks per second).
   * @type {number}
   */
  speed = 10;

  /**
   * Timestamp of the last player activity.
   * @type {number}
   */
  lastActionTime = Date.now();

  /**
   * Timestamp (ms) used to start the jump animation from the first frame.
   * It is refreshed every tick while the character stands on the ground.
   * @type {number}
   */
  jumpStartTime = Date.now();

  /**
   * Collision offsets used to adjust the character's collision box.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 100, bottom: 10, left: 25, right: 35 };

  /**
   * Image paths of the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Image paths of the idle animation.
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Image paths of the long idle (sleeping) animation. Played after
   * 5 seconds without player activity.
   * @type {string[]}
   */
  IMAGES_SLEEP = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * Image paths of the jumping animation.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Image paths of the death animation (played once).
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Image paths of the animation after being hit.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Reference to the game world. Set by {@link World#setWorld}.
   * @type {World}
   */
  world;

  /**
   * Creates the character, loads all images and starts gravity
   * and animations.
   */
  constructor() {
    super();
    this.loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.applyGravity();
    this.animate();
  }

  /**
   * Resets the sleep timer on input or damage.
   * Restarts the sleep animation from the first frame after waking up.
   *
   * @returns {void}
   */
  checkActivity() {
    const kb = this.world.keyboard;
    if (kb.RIGHT || kb.LEFT || kb.SPACE || kb.D || this.isHurt()) {
      if (this.isSleeping()) this.currentImage = 0;
      this.lastActionTime = Date.now();
    }
  }

  /**
   * Checks whether the character has been inactive for more than 5 seconds.
   *
   * @returns {boolean} True if the character should play the sleep animation.
   */
  isSleeping() {
    return Date.now() - this.lastActionTime > 4000;
  }

  /**
   * Starts the movement loop and the animation loop.
   *
   * @returns {void}
   */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 50);
  }

  /**
   * Handles input, movement and camera (60 times per second).
   * Does nothing while the game is paused or no world is set.
   * When dead, only the walking sound is stopped.
   *
   * The space key is reset after a jump, so holding it down
   * does not repeat the jump.
   *
   * @returns {void}
   */
  updateMovement() {
    if (this.isGamePaused()) return;
    if (!this.world) return;
    if (this.isDead()) {
      this.stopWalkSound();
      return;
    }
    this.handleWalking();
    this.checkActivity();
    if (this.world.keyboard.SPACE && !this.isAboveGround() && !this.isJumping) {
      this.jump();
      SoundManager.sounds.jump.volume = 0.2;
      SoundManager.play("jump");
      this.world.keyboard.SPACE = false;
    }
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Moves the character left or right, limited by the level start and end.
   * and the endboss position
   *
   * @returns {void}
   */
  handleWalking() {
    const endboss = this.world.level.endboss;
    const rightLimit = endboss.x - this.width;

    if (this.world.keyboard.RIGHT && this.x < rightLimit) {
      this.moveRight();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
    }
  }

  /**
   * Selects the matching animation (20 times per second).
   * Priority: dead, hurt, in the air, walking, sleeping, idle.
   *
   * @returns {void}
   */
  updateAnimation() {
    if (this.isGamePaused()) return;
    if (!this.world) return;
    if (this.isDead()) {
      this.stopSleepSound();
      this.playDeadAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.stopSleepSound();
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.stopSleepSound();
      this.playJumpAnimation();
    } else {
      this.animateGround();
    }
  }

  /**
   * Plays the walking, sleeping or idle animation with the matching sounds.
   *
   * @returns {void}
   */
  animateGround() {
    this.jumpStartTime = Date.now();
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.playWalkSound();
      this.stopSleepSound();
    } else if (this.isSleeping()) {
      this.playAnimation(this.IMAGES_SLEEP);
      this.playSleepSound();
      this.stopWalkSound();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
      this.stopWalkSound();
      this.stopSleepSound();
    }
  }

  /**
   * Plays the walking sound as a loop if it is not already playing.
   *
   * @returns {void}
   */
  playWalkSound() {
    if (SoundManager.sounds.walk.paused) {
      SoundManager.sounds.walk.loop = true;
      SoundManager.sounds.walk.volume = 0.9;
      SoundManager.sounds.walk.play();
    }
  }

  /**
   * Plays the sleep sound as a loop if it is not already playing.
   *
   * @returns {void}
   */
  playSleepSound() {
    const sound = SoundManager.sounds.sleep;
    if (sound.paused) {
      sound.loop = true;
      sound.play();
    }
  }

  /**
   * Stops the sleep sound and resets it to the beginning.
   *
   * @returns {void}
   */
  stopSleepSound() {
    const sound = SoundManager.sounds.sleep;
    sound.pause();
    sound.currentTime = 0;
  }

  /**
   * Stops the walking sound and resets it to the beginning.
   *
   * @returns {void}
   */
  stopWalkSound() {
    SoundManager.sounds.walk.pause();
    SoundManager.sounds.walk.currentTime = 0;
  }

  /**
   * Plays the jump animation once, 100 ms per frame, and stays on the
   * last frame until the character lands.
   *
   * @returns {void}
   */
  playJumpAnimation() {
    const last = this.IMAGES_JUMPING.length - 1;
    const frame = Math.floor((Date.now() - this.jumpStartTime) / 100);
    this.img = this.imageCache[this.IMAGES_JUMPING[Math.min(frame, last)]];
  }
}
