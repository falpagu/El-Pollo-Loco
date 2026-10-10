/**
 * Handles all collisions of a {@link World}: character against enemies,
 * end boss, coins and bottles, and thrown bottles against enemies and boss.
 */
class CollisionManager {
  /**
   * The world whose objects are checked.
   * @type {World}
   */
  world;

  /**
   * @param {World} world - The world to check.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks all collisions of the character. Does nothing while the
   * character is dead.
   *
   * @returns {void}
   */
  checkCollision() {
    if (this.world.character.isDead()) return;
    this.checkEnemyCollisions();
    this.checkBossCollision();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
  }

  /**
   * Handles contact with normal enemies. All living enemies touched from
   * above in the same tick are killed together and the character bounces
   * once. Without a stomp, touching an enemy damages the character.
   *
   * @returns {void}
   */
  checkEnemyCollisions() {
    const { level, character } = this.world;
    const hits = level.enemies.filter(
      (e) => !e.isDead() && character.isColliding(e, 10),
    );
    const stomped = hits.filter((e) => this.isStomp(e));
    if (stomped.length > 0) {
      this.stompEnemies(stomped);
    } else if (hits.length > 0 && !character.isHurt()) {
      this.damageCharacter();
    }
  }

  /**
   * Kills the stomped enemies and makes the character bounce once.
   *
   * @param {Chicken[]} enemies - The stomped enemies.
   * @returns {void}
   */
  stompEnemies(enemies) {
    const character = this.world.character;
    enemies.forEach((e) => this.killEnemy(e));
    character.speedY = 30;
    character.jumpStartTime = Date.now();
  }

  /**
   * Kills an enemy, plays the smash sound and removes it from the level
   * after 300 ms, so the dead image stays visible for a moment.
   *
   * @param {Chicken} enemy - The enemy to kill.
   * @returns {void}
   */
  killEnemy(enemy) {
    const level = this.world.level;
    enemy.die();
    this.world.playSound("smash", 0.4);
    setTimeout(() => {
      level.enemies = level.enemies.filter((e) => e !== enemy);
    }, 300);
  }

  /**
   * Checks whether the character lands on top of the given enemy.
   *
   * @param {MovableObject} enemy - The enemy that was touched.
   * @returns {boolean} True if it is a stomp.
   */
  isStomp(enemy) {
    const character = this.world.character;
    const feet = character.y + character.height;
    return character.speedY < 0 && feet < enemy.y + 40 && feet > enemy.y;
  }

  /**
   * Damages the character when touching the living end boss.
   * The damage is 20, or 40 once the boss has 40% energy or less.
   *
   * @returns {void}
   */
  checkBossCollision() {
    const { character, level } = this.world;
    const boss = level.endboss;
    if (!boss.isDead() && character.isColliding(boss) && !character.isHurt()) {
      this.damageCharacter(boss.energy <= 40 ? 40 : 20);
    }
  }

  /**
   * Reduces the character's energy, plays the hurt sound and
   * updates the health bar.
   *
   * @param {number} [damage=20] - Energy to subtract.
   * @returns {void}
   */
  damageCharacter(damage = 20) {
    const { character, statusBarHealth } = this.world;
    character.hit(damage);
    this.world.playSound("hurt", 0.1);
    statusBarHealth.setPercentage(character.energy);
  }

  /**
   * Collects coins the character touches and updates the coin bar
   * (maximum 100%).
   *
   * @returns {void}
   */
  checkCoinCollisions() {
    const { character, level, statusBarCoins } = this.world;
    level.coins.forEach((coin, index) => {
      if (!character.isColliding(coin, 30)) return;
      this.world.playSound("coin", 0.2);
      level.coins.splice(index, 1);
      statusBarCoins.setPercentage(
        Math.min(100, statusBarCoins.percentage + 20),
      );
    });
  }

  /**
   * Collects bottles the character touches and updates the bottle bar
   * (maximum 100%).
   *
   * @returns {void}
   */
  checkBottleCollisions() {
    const { character, level, statusBarBottles } = this.world;
    level.bottles.forEach((bottle, index) => {
      if (!character.isColliding(bottle, 30)) return;
      this.world.playSound("bottle", 0.2);
      level.bottles.splice(index, 1);
      statusBarBottles.setPercentage(
        Math.min(100, statusBarBottles.percentage + 20),
      );
    });
  }

  /**
   * Checks every flying bottle for a hit. Bottles that hit something
   * are removed from {@link World#throwableObjects}.
   *
   * @returns {void}
   */
  checkBottleHits() {
    const w = this.world;
    w.throwableObjects.forEach((bottle) => {
      if (!bottle.hasHit) this.checkSingleBottleHit(bottle);
    });
    w.throwableObjects = w.throwableObjects.filter((b) => !b.hasHit);
  }

  /**
   * Checks whether one bottle hits a living enemy or the end boss.
   * A hit enemy is killed, the boss takes damage.
   *
   * @param {ThrowableObject} bottle - The flying bottle.
   * @returns {void}
   */
  checkSingleBottleHit(bottle) {
    const { level } = this.world;
    const boss = level.endboss;
    const enemy = level.enemies.find(
      (e) => !e.isDead() && bottle.isColliding(e),
    );
    if (enemy) {
      bottle.hasHit = true;
      this.killEnemy(enemy);
    } else if (!boss.isDead() && bottle.isColliding(boss)) {
      bottle.hasHit = true;
      this.hitBoss();
    }
  }

  /**
   * Damages the end boss with a bottle, plays the hit sound and
   * updates the boss status bar.
   *
   * @returns {void}
   */
  hitBoss() {
    const { level, statusBarEndboss } = this.world;
    level.endboss.hitByBottle();
    this.world.playSound("bossHit", 0.8);
    statusBarEndboss.setPercentage(level.endboss.energy);
  }
}
