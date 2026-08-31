class World {
  character = new Character();
  level = level_1;
  ctx;
  canvas;
  keyboard;
  camera_x = -100;
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.statusBarHealth = new StatusBar(IMAGES_HEALTH, 30, 0);
    this.statusBarCoins = new StatusBar(IMAGES_COINS, 30, 40);
    this.statusBarBottles = new StatusBar(IMAGES_BOTTLES, 30, 80);
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects(){
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100); 
      this.throwableObjects.push(bottle);
    }

  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottels);
    this.addObjectsToMap(this.throwableObjects);

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
