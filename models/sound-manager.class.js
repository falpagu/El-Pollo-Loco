class SoundManager {
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
    lose: new Audio("assets/audio/lose.mp3")
  };

  static muted = localStorage.getItem('muted') === "true";

  static play(name) {
    let sound = this.sounds[name];
    sound.currentTime = 0;
    sound.play();
  } 


  static toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('muted', this.muted);
    this.applyMute();
  }

  static applyMute() {
    Object.values(this.sounds).forEach(sound => {
      sound.muted = this.muted;
    });
  }
}

SoundManager.applyMute();