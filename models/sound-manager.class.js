class SoundManager {
      static sounds = {
    background: new Audio("assets/audio/background.mp3"),
    walk: new Audio("./assets/audio/walk.mp3"),
    jump: new Audio("assets/audio/jump.mp3"),
    coin: new Audio("assets/audio/coin.mp3"),
    bottle: new Audio("assets/audio/bottle.mp3"),
    hurt: new Audio("assets/audio/hurt.mp3"),
    throw: new Audio("assets/audio/throw.mp3"),
    win: new Audio("assets/audio/win.mp3"),
    lose: new Audio("assets/audio/lose.mp3")
  };


  static play(name) {
    let sound = this.sounds[name];
    sound.currenttime = 0;
    sound.play();
  } 
}