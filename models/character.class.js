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

  /** * Image paths of the idle animation.
   * * @type {string[]}
   * */
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
    this.applyGravity();
    this.animate();
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
   * Does nothing as long as no world is set; when dead, only the
   * walking sound is stopped.
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
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
    this.world.camera_x = -this.x + 100;
  }


  /**
   * Moves the character left or right, limited by the level start and end.
   *
   * @returns {void}
   */
  handleWalking() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
    }
  }


  /**
   * Selects the matching animation (20 times per second).
   * Priority: dead, hurt, in the air, walking, standing.
   *
   * @returns {void}
   */
  updateAnimation() {
    if (this.isGamePaused()) return;
    if (!this.world) return;
    if (this.isDead()) {
      this.playDeadAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      this.animateGround();
    }
  }


  /**
   * Plays the walking animation with sound, or stops the sound when standing still.
   *
   * @returns {void}
   */
  animateGround() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.playWalkSound();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
      this.stopWalkSound();
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
   * Stops the walking sound and resets it to the beginning.
   *
   * @returns {void}
   */
  stopWalkSound() {
    SoundManager.sounds.walk.pause();
    SoundManager.sounds.walk.currentTime = 0;
  }
}
