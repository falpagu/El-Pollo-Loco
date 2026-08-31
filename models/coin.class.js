class Coins extends DrawableObject {

IMAGES_COIN = [
  "assets/img/8_coin/coin_1.png",
  "assets/img/8_coin/coin_2.png"
];


constructor(x, y) {
    super();
     this.loadImage('assets/img/8_coin/coin_1.png');
     this.loadImages(this.IMAGES_COIN);
     this.x = x;
     this.y = y;
     this.width = 100;
     this.height = 100;
    }
}


