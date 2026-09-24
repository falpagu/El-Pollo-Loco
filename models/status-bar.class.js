class StatusBar extends DrawableObject {
  percentage = 100;

  constructor(images, x, y, startPercentage = 100) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 250;
    this.height = 60;
    this.setPercentage(startPercentage);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 0;
    } else if (this.percentage == 80) {
      return 1;
    } else if (this.percentage == 60) {
      return 2;
    } else if (this.percentage == 40) {
      return 3;
    } else if (this.percentage == 20) {
      return 4;
    } else {
      return 5;
    }
  }
}
