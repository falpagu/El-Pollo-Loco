/**
 * Creates new enemies, coins and bottles ahead of the character and
 * removes objects that are far behind it.
 */
class WorldSpawner {
  /**
   * The world in which objects are spawned.
   * @type {World}
   */
  world;

  /**
   * @param {World} world - The world to spawn objects in.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Spawns new objects and removes old ones. Called every 2 seconds.
   *
   * @returns {void}
   */
  update() {
    this.spawnEnemies();
    this.spawnCoins();
    this.spawnBottles();
    this.cleanupObjects();
  }

  /**
   * Checks whether another object of a list may be spawned: the list is
   * below its maximum and the character is not near the level end.
   *
   * @param {Array} list - The current objects.
   * @param {number} max - Maximum number of objects.
   * @returns {boolean} True if a new object may be spawned.
   */
  canSpawn(list, max) {
    const { character, level } = this.world;
    return list.length < max && character.x < level.level_end_x - 300;
  }

  /**
   * Spawns a chicken ahead of the character, up to 8 enemies.
   *
   * @returns {void}
   */
  spawnEnemies() {
    const { character, level } = this.world;
    if (!this.canSpawn(level.enemies, 8)) return;
    const x = character.x + 500 + Math.random() * 300;
    level.enemies.push(new Chicken(Math.min(x, level.level_end_x - 50)));
  }

  /**
   * Spawns a coin at a random position ahead of the character,
   * up to 10 coins.
   *
   * @returns {void}
   */
  spawnCoins() {
    const { character, level } = this.world;
    if (!this.canSpawn(level.coins, 10)) return;
    const x = character.x + 400 + Math.random() * 500;
    const y = 50 + Math.random() * 300;
    level.coins.push(new Coins(Math.min(x, level.level_end_x - 50), y));
  }

  /**
   * Spawns a bottle on the ground ahead of the character,
   * up to 8 bottles.
   *
   * @returns {void}
   */
  spawnBottles() {
    const { character, level } = this.world;
    if (!this.canSpawn(level.bottles, 8)) return;
    const x = character.x + 400 + Math.random() * 500;
    level.bottles.push(new Bottles(Math.min(x, level.level_end_x - 50), 370));
  }

  /**
   * Removes enemies, coins and bottles that are more than 800 px
   * behind the character.
   *
   * @returns {void}
   */
  cleanupObjects() {
    const { character, level } = this.world;
    const minX = character.x - 800;
    level.enemies = level.enemies.filter((e) => e.x > minX);
    level.coins = level.coins.filter((c) => c.x > minX);
    level.bottles = level.bottles.filter((b) => b.x > minX);
  }
}
