class World {
  character = new Character();
  level = level_1;
  ctx;
  canvas;
  keyboard;
  camera_pan = 0;
  throwableObjects = [];
  

  
  BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",

  ];  
  

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
      this.checkCollison();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects(){
    if(this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollison() {
         this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusBarHealth.setPercentage(this.character.energy);
        }
      });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_pan, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_pan, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);

    this.ctx.translate(this.camera_pan, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

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
