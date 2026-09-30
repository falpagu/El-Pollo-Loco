class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 50;
  speed = 1;
  active = false;


  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png"
  ];

  IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png"
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 750;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.active || this.isDead() || this.isHurt()) return;
      this.moveLeft();
      this.otherDirection = false;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playDeadAnimation();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.active) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  hitByBottle() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
  }
}
