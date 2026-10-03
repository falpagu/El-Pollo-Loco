/**
 * Holds all objects of a level: enemies, clouds, background layers,
 * coins and bottles. The end boss is attached afterwards in {@link initLevel}.
 */
class Level {
  /**
   * Normal enemies (chickens) currently in the level.
   * @type {Chicken[]}
   */
  enemies;

  /**
   * Clouds in the background.
   * @type {Cloud[]}
   */
  clouds;

  /**
   * Background layers that make up the scenery.
   * @type {BackgroundObject[]}
   */
  backgroundObjects;

  /**
   * Collectible coins.
   * @type {Coins[]}
   */
  coins;

  /**
   * Collectible bottles lying on the ground.
   * @type {Bottles[]}
   */
  bottles;

  /**
   * End boss of the level. Not set in the constructor,
   * assigned in {@link initLevel}.
   * @type {Endboss}
   */
  endboss;

  /**
   * X position where the level ends. The character cannot walk further right.
   * @type {number}
   */
  level_end_x = 4600;

  /**
   * Creates a level from the given object lists.
   *
   * @param {Chicken[]} enemies - Normal enemies.
   * @param {Cloud[]} clouds - Background clouds.
   * @param {BackgroundObject[]} backgroundObjects - Background layers.
   * @param {Coins[]} coins - Collectible coins.
   * @param {Bottles[]} bottles - Collectible bottles.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}