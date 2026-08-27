class World {
  character = new Character();
  level = level_1;
  ctx;
  canvas;
  keyboard;
  camera_x = -100;

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

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => {
      this.draw();
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

    this.ctx.beginPath();
    this.ctx.lineWidth = "5";
    this.ctx.strokeStyle = "blue";
    this.ctx.rect(movable.x,movable.y, movable.x + movable.width, movable.y + movable.height);
    this.ctx.stroke();

    if (movable.otherDirection) {
      this.ctx.restore();
      movable.x = movable.x * -1;
    }
  }
}
