/**
 * Game world. Owns the character, the level, the status bars and the
 * game loops. Handles collisions, spawning, throwing, pausing and drawing.
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
   * Creates the world, the four status bars, and starts drawing
   * and the game loops.
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
    this.draw();
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
   * Starts the game loops. All of them skip their work while paused.
   *
   * @returns {void}
   */
  run() {
    setInterval(() => {
      if (this.isPaused) return;
      this.checkCollision();
      this.checkThrowObjects();
      this.checkGameEnd();
      this.checkEndbossActivation();
    }, 50);

    setInterval(() => {
      if (this.isPaused) return;
      this.spawnEnemies();
      this.spawnCoins();
      this.spawnBottles();
      this.cleanupObjects();
    }, 2000);

    setInterval(() => {
      if (this.isPaused) return;
      this.checkBottleHits();
    }, 50);
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
   * Spawns a new chicken ahead of the character, up to 8 enemies,
   * as long as the character is not near the end of the level.
   *
   * @returns {void}
   */
  spawnEnemies() {
    if (
      this.level.enemies.length < 8 &&
      this.character.x < this.level.level_end_x - 300
    ) {
      let chicken = new Chicken();
      chicken.x = this.character.x + 500 + Math.random() * 300;
      chicken.x = Math.min(chicken.x, this.level.level_end_x - 50);
      this.level.enemies.push(chicken);
    }
  }

  /**
   * Spawns a coin at a random position ahead of the character,
   * up to 10 coins.
   *
   * @returns {void}
   */
  spawnCoins() {
    if (
      this.level.coins.length < 10 &&
      this.character.x < this.level.level_end_x - 300
    ) {
      let x = this.character.x + 400 + Math.random() * 500;
      x = Math.min(x, this.level.level_end_x - 50);

      let y = 50 + Math.random() * 300;
      this.level.coins.push(new Coins(x, y));
    }
  }

  /**
   * Spawns a bottle on the ground ahead of the character,
   * up to 8 bottles.
   *
   * @returns {void}
   */
  spawnBottles() {
    if (
      this.level.bottles.length < 8 &&
      this.character.x < this.level.level_end_x - 300
    ) {
      let x = this.character.x + 400 + Math.random() * 500;
      x = Math.min(x, this.level.level_end_x - 50);
      this.level.bottles.push(new Bottles(x, 370));
    }
  }

  /**
   * Removes enemies, coins and bottles that are more than 800 px
   * behind the character.
   *
   * @returns {void}
   */
  cleanupObjects() {
    this.level.enemies = this.level.enemies.filter(
      (e) => e.x > this.character.x - 800,
    );
    this.level.coins = this.level.coins.filter(
      (c) => c.x > this.character.x - 800,
    );
    this.level.bottles = this.level.bottles.filter(
      (b) => b.x > this.character.x - 800,
    );
  }

  /**
   * Throws a bottle when D is pressed, the bottle bar is not empty and
   * the 500 ms cooldown has passed. Does nothing while the character is dead.
   *
   * @returns {void}
   */
  checkThrowObjects() {
    if (this.character.isDead()) return;

    let now = Date.now();
    if (
      this.keyboard.D &&
      this.statusBarBottles.percentage > 0 &&
      now - (this.lastThrow || 0) > 500
    ) {
      this.lastThrow = now;
      SoundManager.sounds.throw.volume = 0.2;
      SoundManager.play("throw");
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.statusBarBottles.setPercentage(
        this.statusBarBottles.percentage - 20,
      );
    }
  }

  /**
   * Checks all collisions of the character with enemies, the end boss,
   * coins and bottles. Does nothing while the character is dead.
   *
   * @returns {void}
   */
  checkCollision() {
    if (this.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBossCollision();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
  }

  /**
   * Handles contact with normal enemies: stomp from above or damage.
   *
   * @returns {void}
   */
  checkEnemyCollisions() {
    let deadEnemies = [];
    let stomped = false;

    this.level.enemies.forEach((enemy, index) => {
      if (!this.character.isColliding(enemy)) return;

      if (this.isStomp(enemy)) {
        enemy.die();
        this.playSound("smash", 0.4);
        deadEnemies.push(enemy);
        this.character.jump();
        stomped = true;
      } else if (!this.character.isHurt()) {
        this.damageCharacter();
      }
    });

    if (stomped) {
      this.character.jump();
    }

    setTimeout(() => {
      deadEnemies.forEach((enemy) => {
        let index = this.level.enemies.indexOf(enemy);
        if (index !== -1) {
          this.level.enemies.splice(index, 1);
        }
      });
    }, 300);
  }

  /**
   * Checks whether the character lands on top of the given enemy.
   *
   * @param {MovableObject} enemy - The enemy that was touched.
   * @returns {boolean} True if it is a stomp.
   */
  isStomp(enemy) {
    let characterFeet = this.character.y + this.character.height;
    return this.character.speedY < 0 && characterFeet < enemy.y + 40;
  }

  /**
   * Damages the character when touching the living end boss.
   *
   * @returns {void}
   */
  checkBossCollision() {
    let boss = this.level.endboss;
    if (
      !boss.isDead() &&
      this.character.isColliding(boss) &&
      !this.character.isHurt()
    ) {
      this.damageCharacter(boss.energy <= 40 ? 40 : 20);
    }
  }

  /**
   * Reduces the character's energy, plays the hurt sound and
   * updates the health bar.
   *
   * @returns {void}
   */
  damageCharacter(damage = 20) {
    this.character.hit(damage);
    this.playSound("hurt", 0.1);
    this.statusBarHealth.setPercentage(this.character.energy);
  }

  /**
   * Collects coins the character touches and updates the coin bar.
   *
   * @returns {void}
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (!this.character.isColliding(coin)) return;
      this.playSound("coin", 0.2);
      this.level.coins.splice(index, 1);
      this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
    });
  }

  /**
   * Collects bottles the character touches and updates the bottle bar.
   *
   * @returns {void}
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (!this.character.isColliding(bottle, 10)) return;
      this.playSound("bottle", 0.2);
      this.level.bottles.splice(index, 1);
      this.statusBarBottles.setPercentage(
        this.statusBarBottles.percentage + 20,
      );
    });
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
   * Checks whether thrown bottles hit an enemy or the end boss.
   * A hit enemy is removed, the boss takes damage. Bottles that hit
   * something are removed from {@link World#throwableObjects}.
   *
   * @returns {void}
   */
  checkBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;

      let enemy = this.level.enemies.find((e) => bottle.isColliding(e));
      if (enemy) {
        bottle.hasHit = true;
        this.level.enemies = this.level.enemies.filter((e) => e !== enemy);
        SoundManager.sounds.smash.volume = 0.2;
        SoundManager.play("smash");
      } else if (
        !this.level.endboss.isDead() &&
        bottle.isColliding(this.level.endboss)
      ) {
        bottle.hasHit = true;
        this.level.endboss.hitByBottle();
        SoundManager.sounds.bossHit.volume = 0.8;
        SoundManager.play("bossHit");
        this.statusBarEndboss.setPercentage(this.level.endboss.energy);
      }
    });
    this.throwableObjects = this.throwableObjects.filter((b) => !b.hasHit);
  }

  /**
   * Draws one frame: background, status bars, game objects and the pause
   * overlay, then schedules the next frame.
   *
   * @returns {void}
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    if (this.isPaused) this.drawPauseOverlay();
    this.animationFrame = requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws the background layers, shifted by the camera position.
   *
   * @returns {void}
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws the fixed status bars (not affected by the camera).
   *
   * @returns {void}
   */
  drawStatusBars() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    this.addToMap(this.statusBarEndboss);
  }

  /**
   * Draws character, end boss, clouds, enemies, collectibles and
   * thrown bottles, shifted by the camera position.
   *
   * @returns {void}
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addToMap(this.level.endboss);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Darkens the canvas and shows the "PAUSE" text in the center.
   *
   * @returns {void}
   */
  drawPauseOverlay() {
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "40px Rye";
    this.ctx.fillText(
      "PAUSE",
      this.canvas.width / 2 - 80,
      this.canvas.height / 2,
    );
  }

  /**
   * Draws a list of objects onto the canvas.
   *
   * @param {DrawableObject[]} objects - Objects to draw.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single object. Objects facing left are mirrored while drawing.
   *
   * @param {DrawableObject} movable - Object to draw.
   * @returns {void}
   */
  addToMap(movable) {
    if (movable.otherDirection) {
      this.flipImage(movable);
    }

    movable.draw(this.ctx);
    // movable.drawFrame(this.ctx);

    if (movable.otherDirection) {
      this.flipImageBack(movable);
    }
  }

  /**
   * Mirrors the canvas horizontally and inverts the object's X position,
   * so the image is drawn flipped at the correct place.
   * Must be followed by {@link World#flipImageBack}.
   *
   * @param {DrawableObject} movable - Object to flip.
   * @returns {void}
   */
  flipImage(movable) {
    this.ctx.save();
    this.ctx.translate(movable.width, 0);
    this.ctx.scale(-1, 1);
    movable.x = movable.x * -1;
  }

  /**
   * Restores the canvas state and the object's X position
   * after {@link World#flipImage}.
   *
   * @param {DrawableObject} movable - Object to restore.
   * @returns {void}
   */
  flipImageBack(movable) {
    movable.x = movable.x * -1;
    this.ctx.restore();
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
