/**
 * Central manager for all game sounds. Holds one `Audio` object per sound
 * and handles playing, pausing and muting. The mute state is stored in `localStorage`.
 */
class SoundManager {
  /**
   * All game sounds, accessible by name.
   * @type {Object<string, HTMLAudioElement>}
   */
  static sounds = {
    background: new Audio("assets/audio/background.mp3"),
    walk: new Audio("assets/audio/walk.mp3"),
    chicken: new Audio("./assets/audio/chicken02.mp3"),
    jump: new Audio("assets/audio/jump.mp3"),
    coin: new Audio("assets/audio/coin.mp3"),
    bottle: new Audio("assets/audio/bottle.mp3"),
    smash: new Audio("assets/audio/smash.mp3"),
    bossHit: new Audio("assets/audio/boss_hit.mp3"),
    hurt: new Audio("assets/audio/hurt.mp3"),
    throw: new Audio("assets/audio/throw.mp3"),
    win: new Audio("assets/audio/win.mp3"),
    lose: new Audio("assets/audio/lose.mp3"),
    sleep: new Audio("assets/audio/snore.mp3")
  };

  /**
   * Whether all sounds are muted. Initialized from `localStorage`,
   * so the setting survives a page reload.
   * @type {boolean}
   */
  static muted = localStorage.getItem("muted") === "true";

  /**
   * Sounds that were playing when the game was paused.
   * @type {HTMLAudioElement[]}
   */
  static pausedSounds = [];

  /**
   * Plays a sound from the beginning. If it is already playing,
   * it restarts.
   *
   * @param {string} name - Key in {@link SoundManager.sounds}, e.g. `"coin"`.
   * @returns {void}
   */
  static play(name) {
    let sound = this.sounds[name];
    sound.currentTime = 0;
    sound.play();
  }

  /**
   * Pauses all currently playing sounds and remembers them,
   * so {@link SoundManager.resumeAll} can continue them.
   *
   * @returns {void}
   */
  static pauseAll() {
    this.pausedSounds = Object.values(this.sounds).filter((s) => !s.paused);
    this.pausedSounds.forEach((s) => s.pause());
  }

  /**
   * Resumes the sounds that were paused by {@link SoundManager.pauseAll}
   * from the position where they stopped.
   *
   * @returns {void}
   */
  static resumeAll() {
    this.pausedSounds.forEach((s) => s.play());
    this.pausedSounds = [];
  }

  /**
   * Toggles the mute state, saves it to `localStorage` and applies it
   * to all sounds.
   *
   * @returns {void}
   */
  static toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("muted", this.muted);
    this.applyMute();
  }

  /**
   * Sets the `muted` property of every sound to the current mute state.
   *
   * @returns {void}
   */
  static applyMute() {
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = this.muted;
    });
  }
}

SoundManager.applyMute();