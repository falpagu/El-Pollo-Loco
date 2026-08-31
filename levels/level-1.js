const level_1 = new Level (
  [new Chicken(), new Chicken(), new Chicken(), new Endboss],
  [new Cloud()],
  [
    new BackgroundObject("assets/img/5_background/layers/air.png", -719),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      -719,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      -719,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/2.png",
      -719,
    ),

    new BackgroundObject("assets/img/5_background/layers/air.png", 0),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/1.png",
      0,
    ),
    new BackgroundObject("assets/img/5_background/layers/air.png", 719),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      719,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      719,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/2.png",
      719,
    ),
    new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/3_third_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "assets/img/5_background/layers/1_first_layer/2.png",
      719 * 3,
    ),
  ],
    [
    new Coins(200, 300),
    new Coins(400, 250),
    new Coins(600, 300),
    new Coins(800, 250),
    new Coins(1000,300)
  ],
  [
    new Bottles(300, 350),
    new Bottles(550, 360),
    new Bottles(900, 350)
  ]
);
