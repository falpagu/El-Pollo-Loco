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
    this.statusBarHealth = new StatusBar(IMAGES_HEALTH, 30, 0, 100);
    this.statusBarCoins = new StatusBar(IMAGES_COINS, 30, 40, 0);
    this.statusBarBottles = new StatusBar(IMAGES_BOTTLES, 30, 80, 0);
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

    setInterval(() => {
      this.spawnEnemies();
      this.spawnCoins();
      this.spawnBottles();
      this.cleanupObjects();
    }, 2000);
  }

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

  spawnBottles() {
    if (
      this.level.bottels.length < 8 &&
      this.character.x < this.level.level_end_x - 300
    ) {
      let x = this.character.x + 400 + Math.random() * 500;
      x = Math.min(x, this.level.level_end_x - 50);
      this.level.bottels.push(new Bottles(x, 370));
    }
  }

  cleanupObjects() {
    this.level.enemies = this.level.enemies.filter(
      (e) => e.x > this.character.x - 800,
    );
    this.level.coins = this.level.coins.filter(
      (c) => c.x > this.character.x - 800,
    );
    this.level.bottels = this.level.bottels.filter(
      (b) => b.x > this.character.x - 800,
    );
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.statusBarBottles.percentage > 0) {
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

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });

    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        SoundManager.sounds.coin.play();
        SoundManager.sounds.coin.volume = 0.2;
        this.level.coins.splice(index, 1);
        this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
      }
    });

    this.level.bottels.forEach((bottel, index) => {
      if (this.character.isColliding(bottel)) {
        SoundManager.sounds.bottle.play();
        SoundManager.sounds.bottle.volume = 0.2;
        this.level.bottels.splice(index, 1);
        this.statusBarBottles.setPercentage(
          this.statusBarBottles.percentage + 20,
        );
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
    this.addToMap(this.level.endboss);

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
