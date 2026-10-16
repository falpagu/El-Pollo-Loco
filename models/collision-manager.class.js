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
      (e) => !e.isDead() && character.isColliding(e),
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
    if (character.hasStomped) return;
    character.hasStomped = true;
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
    SoundManager.play("smash");
    setTimeout(() => {
      level.enemies = level.enemies.filter((e) => e !== enemy);
    }, 300);
  }

  /**
   * Checks whether the character is falling and therefore stomps
   * an enemy on contact.
   *
   * @returns {boolean} True if the character is falling.
   */
  isStomp(enemy) {
    return this.world.character.speedY < 0;
  }

  /**
   * Damages the character when touching the living end boss.
   *
   * @returns {void}
   */
  checkBossCollision() {
    const { character, level } = this.world;
    const boss = level.endboss;

    if (boss.isDead()) return;
    if (!character.isColliding(boss)) return;
    if (character.isHurt()) return;
    SoundManager.play("bossAngry");
    this.damageCharacter(40);
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
    SoundManager.play("hurt");
    statusBarHealth.setPercentage(character.energy);
    if (character.energy === 0) {
      SoundManager.play("pepeDead");
    }
  }

  /**
   * Collects coins the character touches and updates the coin bar
   * (maximum 100%).
   *
   * @returns {void}
   */
  checkCoinCollisions() {
    const { character, level, statusBarCoins } = this.world;
    level.coins = level.coins.filter((coin) => {
      if (!character.isColliding(coin)) return true;
      SoundManager.play("coin");
      statusBarCoins.setPercentage(
        Math.min(100, statusBarCoins.percentage + 5),
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
    level.bottles = level.bottles.filter((bottle) => {
      if (!character.isColliding(bottle)) return true;
      if (statusBarBottles.percentage >= 100) return true;
      SoundManager.play("bottle");
      statusBarBottles.setPercentage(
        Math.min(100, statusBarBottles.percentage + 10),
      );
      return false;
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
    w.throwableObjects = w.throwableObjects.filter((b) => !b.removable);
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
      bottle.splash();
      this.killEnemy(enemy);
    } else if (!boss.isDead() && bottle.isColliding(boss)) {
      bottle.splash();
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
    const boss = level.endboss;
    level.endboss.hitByBottle();
    SoundManager.play("bossHit");
    SoundManager.play("attack");
    statusBarEndboss.setPercentage(boss.energy);
    SoundManager.play(boss.energy === 0 ? "bossDead" : "bossHit");
  }
}
