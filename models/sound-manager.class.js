/**
 * Central manager for all game sounds. Holds one `Audio` object per sound
 * and handles playing, pausing and muting. The mute state is stored in
 * `localStorage`.
 */
class SoundManager {
  /**
   * All game sounds, accessible by name. Ordered by game flow:
   * music, character, collecting, fight, enemies, game end.
   * @type {Object<string, HTMLAudioElement>}
   */
  static sounds = {
    // Music
    background: new Audio("assets/audio/background.mp3"),

    // Character
    walk: new Audio("assets/audio/walk.mp3"),
    jump: new Audio("assets/audio/jump.mp3"),
    sleep: new Audio("assets/audio/snore.mp3"),
    hurt: new Audio("assets/audio/hurt.mp3"),

    // Collecting
    coin: new Audio("assets/audio/coin.mp3"),
    bottle: new Audio("assets/audio/bottle.mp3"),

    // Fight
    throw: new Audio("assets/audio/throw.mp3"),
    smash: new Audio("assets/audio/smash.mp3"),
    bossHit: new Audio("assets/audio/boss_hit.mp3"),
    bossAttack: new Audio("assets/audio/attack.mp3"),
    splash: new Audio("assets/audio/splash.mp3"),
    bossDead: new Audio("assets/audio/boss-dead.mp3"),
    pepeDead: new Audio("assets/audio/pepe-dead.mp3"),
    bossAngry: new Audio("assets/audio/angry.mp3"),
    bossWalk: new Audio("assets/audio/boss-walk.mp3"),

    // Enemies
    chicken: new Audio("assets/audio/chicken.mp3"),
    smallChicken: new Audio("assets/audio/small-chicken.mp3"),
    

    // Game end
    win: new Audio("assets/audio/win.mp3"),
    lose: new Audio("assets/audio/lose.mp3"),
  };

  /**
   * Volume per sound (0 to 1). Sounds without an entry play at full
   * volume. Same order as {@link SoundManager.sounds}.
   * @type {Object<string, number>}
   */
  static volumes = {
    background: 0.02,

    walk: 0.9,
    jump: 0.2,
    sleep: 0.5,
    hurt: 0.2,

    coin: 0.2,
    bottle: 0.2,

    throw: 0.2,
    smash: 0.4,
    bossHit: 0.8,
    bossAttack: 0.6,
    splash: 0.7,
    bossDead: 0.9,
    pepeDead: 0.7,
    bossAngry: 0.5,

    chicken: 0.05,
    smallChicken: 0.07,
    bossWalk: 0.7,

    win: 0.4,
    lose: 0.4,
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
   * Plays a sound from the beginning with its volume from
   * {@link SoundManager.volumes}. If it is already playing, it restarts.
   * Unknown names are ignored, and blocked playback (browser autoplay
   * rules) does not cause an error.
   *
   * @param {string} name - Key in {@link SoundManager.sounds}, e.g. `"coin"`.
   * @returns {void}
   */
  static play(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    if (this.volumes[name] !== undefined) sound.volume = this.volumes[name];
    sound.currentTime = 0;
    sound.play().catch(() => {});
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
    this.pausedSounds.forEach((s) => s.play().catch(() => {}));
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
SoundManager.sounds.background.loop = true;
SoundManager.sounds.walk.loop = true;
SoundManager.sounds.sleep.loop = true;
SoundManager.sounds.bossWalk.loop = true;
