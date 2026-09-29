class Chicken extends MovableObject {
  height = 55;
  width = 70;
  y = 380;

  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super();
    this.loadImage(
      "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 500;
    this.animate();
    this.speed = 0.15 + Math.random() * 0.35;
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
      SoundManager.sounds.chicken.play();
      SoundManager.sounds.chicken.volume = 0.01;
    }, 200);
  }
}
