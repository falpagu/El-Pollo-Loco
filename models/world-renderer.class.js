/**
 * Draws the frames of a {@link World}: background, status bars,
 * game objects and the pause overlay.
 */
class WorldRenderer {
  /**
   * The world that is drawn.
   * @type {World}
   */
  world;

  /**
   * @param {World} world - The world to draw.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws one frame and schedules the next one. The frame ID is stored
   * on the world, so `stopGame()` can cancel it.
   *
   * @returns {void}
   */
  draw() {
    const w = this.world;
    w.ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    if (w.isPaused) this.drawPauseOverlay();
    w.animationFrame = requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws the background layers, shifted by the camera position.
   *
   * @returns {void}
   */
  drawBackground() {
    const { ctx, camera_x, level } = this.world;
    ctx.translate(camera_x, 0);
    this.addObjectsToMap(level.backgroundObjects);
    ctx.translate(-camera_x, 0);
  }

  /**
   * Draws the fixed status bars (not affected by the camera).
   *
   * @returns {void}
   */
  drawStatusBars() {
    const w = this.world;
    this.addToMap(w.statusBarHealth);
    this.addToMap(w.statusBarCoins);
    this.addToMap(w.statusBarBottles);
    this.addToMap(w.statusBarEndboss);
  }

  /**
   * Draws character, end boss, clouds, enemies, collectibles and
   * thrown bottles, shifted by the camera position.
   *
   * @returns {void}
   */
  drawGameObjects() {
    const { ctx, camera_x, character, level, throwableObjects } = this.world;
    ctx.translate(camera_x, 0);
    this.addToMap(character);
    this.addToMap(level.endboss);
    this.addObjectsToMap(level.clouds);
    this.addObjectsToMap(level.enemies);
    this.addObjectsToMap(level.coins);
    this.addObjectsToMap(level.bottles);
    this.addObjectsToMap(throwableObjects);
    ctx.translate(-camera_x, 0);
  }

  /**
   * Darkens the canvas and shows the "PAUSE" text in the center.
   *
   * @returns {void}
   */
  drawPauseOverlay() {
    const { ctx, canvas } = this.world;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Rye";
    ctx.fillText("PAUSE", canvas.width / 2 - 80, canvas.height / 2);
  }

  /**
   * Draws a list of objects onto the canvas.
   *
   * @param {DrawableObject[]} objects - Objects to draw.
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws a single object. Objects facing left are mirrored while drawing.
   *
   * @param {DrawableObject} movable - Object to draw.
   * @returns {void}
   */
  addToMap(movable) {
    if (movable.otherDirection) this.flipImage(movable);
    movable.draw(this.world.ctx);
    // movable.drawFrame(this.world.ctx);
    if (movable.otherDirection) this.flipImageBack(movable);
  }

  /**
   * Mirrors the canvas horizontally and inverts the object's X position,
   * so the image is drawn flipped at the correct place.
   * Must be followed by {@link WorldRenderer#flipImageBack}.
   *
   * @param {DrawableObject} movable - Object to flip.
   * @returns {void}
   */
  flipImage(movable) {
    const ctx = this.world.ctx;
    ctx.save();
    ctx.translate(movable.width, 0);
    ctx.scale(-1, 1);
    movable.x = movable.x * -1;
  }

  /**
   * Restores the canvas state and the object's X position
   * after {@link WorldRenderer#flipImage}.
   *
   * @param {DrawableObject} movable - Object to restore.
   * @returns {void}
   */
  flipImageBack(movable) {
    movable.x = movable.x * -1;
    this.world.ctx.restore();
  }
}
