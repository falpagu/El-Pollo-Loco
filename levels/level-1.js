/**
 * Aktuelles Level des Spiels. Wird bei jedem Start/Restart
 * durch {@link initLevel} neu erzeugt.
 * @type {Level}
 */
let level_1;

/**
 * Initialisiert das Level und weist es der globalen Variable {@link level_1} zu.
 *
 * Bei jedem Aufruf werden neue Instanzen von Gegnern, Wolken, Hintergründen,
 * Münzen, Flaschen und Endboss erzeugt. Dadurch startet das Spiel beim Restart
 * ohne Seiten-Reload wieder im Ausgangszustand.
 *
 * Muss vor `new World(...)` aufgerufen werden.
 *
 * @returns {void}
 */
function initLevel() {
  level_1 = new Level(
    // Gegner
    [new Chicken(), new Chicken(), new Chicken()],

    // Wolken
    [new Cloud()],

    // Hintergrundobjekte (Abschnitte à 719 px, je Luft + 2 Mittelebenen + Vordergrund)
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

    // Münzen (x, y)
    [
      new Coins(200, 300),
      new Coins(400, 250),
      new Coins(600, 300),
      new Coins(800, 250),
      new Coins(1000, 300),
    ],

    // Flaschen (x, y)
    [new Bottles(300, 350), new Bottles(550, 360), new Bottles(900, 350)],
  );

  level_1.endboss = new Endboss();
  level_1.endboss.x = 1900;
  level_1.endboss.active = false;
  level_1.level_end_x = 2200;
}
