class World extends DrawableObject
 {
  character = new Character();
  level = level_1;
  ctx;
  canvas;
  keyboard;
  camera_pan = 0;
  statusBar = new StatusBar();

  constructor(canvas, keyboard) {
    super();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {          
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      });
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_pan, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_pan, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_pan, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_pan, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(movable) {
    if (movable.otherDirection) {
      this.flipImage(movable);
    }

    movable.draw(this.ctx);
    movable.drawFrame(this.ctx);

    if (movable.otherDirection) {
      this.flipImageBack(movable);
    }
  }

  flipImage(movable) {
    this.ctx.save();
    this.ctx.translate(movable.width, 0);
    this.ctx.scale(-1, 1);
    movable.x = movable.x * -1;
  }

  flipImageBack(movable) {
    movable.x = movable.x * -1;
    this.ctx.restore();
  }
}
