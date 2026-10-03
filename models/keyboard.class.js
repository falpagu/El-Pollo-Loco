/**
 * Stores the current state of all game keys.
 * A value is `true` while the key (or touch button) is held down.
 */
class Keyboard {
  /**
   * Left arrow key.
   * @type {boolean}
   */
  LEFT = false;

  /**
   * Right arrow key.
   * @type {boolean}
   */
  RIGHT = false;

  /**
   * Up arrow key.
   * @type {boolean}
   */
  UP = false;

  /**
   * Down arrow key.
   * @type {boolean}
   */
  DOWN = false;

  /**
   * Space bar (jump).
   * @type {boolean}
   */
  SPACE = false;

  /**
   * D key (throw bottle).
   * @type {boolean}
   */
  D = false;
}