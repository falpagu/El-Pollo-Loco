class World {
  character = new Character();
  enemies = level_1.enemies;
  clouds = level_1.clouds;
  backgroundObjects = level_1.backgroundObjects;

  ctx;
  canvas;
  keyboard;
  camera_pan = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_pan, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);

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
      this.ctx.save();
      this.ctx.translate(movable.width, 0);
      this.ctx.scale(-1, 1);
      movable.x = movable.x * -1;
    }

    this.ctx.drawImage(
      movable.img,
      movable.x,
      movable.y,
      movable.width,
      movable.height,
    );

    if (movable.otherDirection) {
      movable.x = movable.x * -1;
      this.ctx.restore();
    }
  }
}
