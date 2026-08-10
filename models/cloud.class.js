class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 170;


  constructor() {
    super();
    this.loadImage("assets/img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }


}
