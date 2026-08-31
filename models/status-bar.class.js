class StatusBar extends DrawableObject {
  percenttage = 100;

  constructor(images, x, y) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percenttage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percenttage == 100) {
      return 5;
    } else if (this.percenttage == 80) {
      return 4;
    } else if (this.percenttage == 60) {
      return 3;
    } else if (this.percenttage == 40) {
      return 2;
    } else if (this.percenttage == 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
