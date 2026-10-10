/**
 * Game world. Owns the character, the level, the status bars and the
 * game loops. Handles pausing, throwing, boss activation and the game end.
 * Delegates drawing, spawning and collisions to {@link WorldRenderer},
 * {@link WorldSpawner} and {@link CollisionManager}.
 */
class World {
  /**
   * The player character.
   * @type {Character}
   */
  character = new Character();

  /**
   * Current level, taken from the global {@link level_1}.
   * @type {Level}
   */
  level = level_1;

  /**
   * 2D drawing context of the canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * The game canvas.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * Current state of all game keys.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * Horizontal camera offset. Updated by the {@link Character}.
   * @type {number}
   */
  camera_x = -100;

  /**
   * Bottles that are currently flying.
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * True once the game is over, so the end screen is triggered only once.
   * @type {boolean}
   */
  gameOver = false;

  /**
   * Whether the game is paused.
   * @type {boolean}
   */
  isPaused = false;

  /**
   * Timestamp (ms) of the last bottle throw. Used for the throw cooldown.
   * @type {number|undefined}
   */
  lastThrow;

  /**
   * ID of the pending animation frame. Used by `cancelAnimationFrame`.
   * @type {number}
   */
  animationFrame;

  /**
   * Status bar showing the character's health.
   * @type {StatusBar}
   */
  statusBarHealth;

  /**
   * Status bar showing the collected coins.
   * @type {StatusBar}
   */
  statusBarCoins;

  /**
   * Status bar showing the available bottles.
   * @type {StatusBar}
   */
  statusBarBottles;

  /**
   * Status bar showing the end boss energy.
   * @type {StatusBar}
   */
  statusBarEndboss;

  /**
   * Draws the frames of this world.
   * @type {WorldRenderer}
   */
  renderer;

  /**
   * Spawns and removes enemies, coins and bottles.
   * @type {WorldSpawner}
   */
  spawner;

  /**
   * Handles all collisions.
   * @type {CollisionManager}
   */
  collisions;

  /**
   * Creates the world, the four status bars and the helper classes,
   * and starts drawing and the game loops.
   *
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - Shared keyboard state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.statusBarHealth = new StatusBar(IMAGES_HEALTH, 30, 0, 100);
    this.statusBarCoins = new StatusBar(IMAGES_COINS, 30, 40, 0);
    this.statusBarBottles = new StatusBar(IMAGES_BOTTLES, 30, 80, 0);
    this.statusBarEndboss = new StatusBar(IMAGES_ENDBOSS, 30, 120, 100);
    this.renderer = new WorldRenderer(this);
    this.spawner = new WorldSpawner(this);
    this.collisions = new CollisionManager(this);
    this.renderer.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Switches between paused and running. Pauses or resumes all sounds.
   * Does nothing after the game is over.
   *
   * @returns {void}
   */
  togglePause() {
    if (this.gameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      SoundManager.pauseAll();
    } else {
      SoundManager.resumeAll();
    }
  }

  /**
   * Gives the character a reference to this world.
   *
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the game loops. All of them skip their work while paused:
   * 1. Every 1000/60 ms: collisions, throwing, game end, boss activation.
   * 2. Every 2000 ms: spawning and cleanup of objects.
   * 3. Every 50 ms: bottle hit detection.
   *
   * @returns {void}
   */
  run() {
    setInterval(() => {
      if (!this.isPaused) this.updateGame();
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isPaused) this.spawner.update();
    }, 2000);

    setInterval(() => {
      if (!this.isPaused) this.collisions.checkBottleHits();
    }, 50);
  }

  /**
   * Runs the frequent game checks: collisions, throwing,
   * game end and boss activation.
   *
   * @returns {void}
   */
  updateGame() {
    this.collisions.checkCollision();
    this.checkThrowObjects();
    this.checkGameEnd();
    this.checkEndbossActivation();
  }

  /**
   * Ends the game once, 1.5 seconds after the character or the end boss
   * has died. Shows the lose screen or the win screen.
   *
   * @returns {void}
   */
  checkGameEnd() {
    if (this.gameOver) return;
    if (this.character.isDead()) {
      this.gameOver = true;
      setTimeout(() => endGame(false), 1500);
    } else if (this.level.endboss.isDead()) {
      this.gameOver = true;
      setTimeout(() => endGame(true), 1500);
    }
  }

  /**
   * Throws a bottle in the character's facing direction when D is pressed,
   * the bottle bar is not empty and the 500 ms cooldown has passed.
   * Does nothing while the character is dead.
   *
   * @returns {void}
   */
  checkThrowObjects() {
    if (this.character.isDead()) return;
    let now = Date.now();
    let canThrow =
      this.keyboard.D &&
      this.statusBarBottles.percentage > 0 &&
      now - (this.lastThrow || 0) > 500;
    if (!canThrow) return;
    this.lastThrow = now;
    this.throwBottle();
  }

  /**
   * Creates a bottle at the character's side, plays the throw sound
   * and lowers the bottle bar.
   *
   * @returns {void}
   */
  throwBottle() {
    let toLeft = this.character.otherDirection;
    let startX = toLeft ? this.character.x - 20 : this.character.x + 100;
    this.playSound("throw", 0.2);
    this.throwableObjects.push(
      new ThrowableObject(startX, this.character.y + 100, toLeft),
    );
    this.statusBarBottles.setPercentage(this.statusBarBottles.percentage - 20);
  }

  /**
   * Sets the volume of a sound and plays it from the start.
   *
   * @param {string} name - Key in {@link SoundManager.sounds}.
   * @param {number} volume - Volume between 0 and 1.
   * @returns {void}
   */
  playSound(name, volume) {
    SoundManager.sounds[name].volume = volume;
    SoundManager.play(name);
  }

  /**
   * Activates the end boss when the character is within 600 px of it.
   *
   * @returns {void}
   */
  checkEndbossActivation() {
    let boss = this.level.endboss;
    if (!boss.active && this.character.x > boss.x - 600) {
      boss.active = true;
    }
  }
}
