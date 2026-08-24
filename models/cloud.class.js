class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 200;

  constructor() {
    super().loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
  }
}
