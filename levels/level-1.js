/**
 * Current level of the game. Recreated on every start/restart
 * by {@link initLevel}.
 * @type {Level}
 */
let level_1;

/**
 * Initializes the level and assigns it to the global variable {@link level_1}.
 *
 * On every call, new instances of enemies, clouds, background objects,
 * coins, bottles and the endboss are created. This way the game starts
 * in its initial state again after a restart, without reloading the page.
 *
 * Must be called before `new World(...)`.
 *
 * @returns {void}
 */
function initLevel() {
  level_1 = new Level(
    // Enemies
    [new Chicken(500), new Chicken(900), new Chicken(1000)],

    // Clouds
    [new Cloud()],

    // Background objects (sections of 719 px, each: air + 2 middle layers + foreground)
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

    // Coins (x, y)
    [
      new Coins(200, 300),
      new Coins(400, 250),
      new Coins(600, 300),
      new Coins(800, 250),
      new Coins(1000, 300),
    ],

    // Bottles (x, y)
    [new Bottles(300, 350), new Bottles(550, 360), new Bottles(900, 350)],
  );

  level_1.endboss = new Endboss();
  level_1.endboss.x = 1900;
  level_1.endboss.active = false;
  level_1.level_end_x = 2200;
}
