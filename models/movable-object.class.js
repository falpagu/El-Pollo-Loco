class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  accelertion = 4;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveground() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.accelertion;
      }
    }, 1000 / 25);
  }

  isAboveground() {
    return this.y < 230;
  }

  isColliding(movable) {
    return;
    this.x + this.width > movable.x &&
      this.y + this.height > movable.y &&
      this.x < movable.x &&
      this.y < movable.y + movable.height;
  }

  hit() {
    this.energy -= 5;

    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;

    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playImages(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
