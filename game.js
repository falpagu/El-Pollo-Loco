let canvas;
let world;
let keyboard = new Keyboard();

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("fullscreenBtn").style.display = "flex";
  document.getElementById("muteBtn").style.display = "block";
  SoundManager.sounds.background.loop = true;
  SoundManager.sounds.background.volume = 0.02;
  SoundManager.sounds.background.play();
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  initLevel();
  world = new World(canvas, keyboard);
}

function stopGame() {
  const last = setInterval(() => {}, 100000);
  for (let i = 0; i <= last; i++) clearInterval(i);
  cancelAnimationFrame(world.animationFrame);
  SoundManager.sounds.walk.pause();
  SoundManager.sounds.chicken.pause();
}

function endGame(won) {
  stopGame();
  SoundManager.sounds.background.pause();
  SoundManager.play(won ? "win" : "lose");
  document.getElementById("endImage").src = won
    ? "./assets/img/You won, you lost/You Won B.png"
    : "./assets/img/You won, you lost/You lost.png";
  document.getElementById("endScreen").style.display = "flex";
}

function restartGame() {
  document.getElementById("endScreen").style.display = "none";
  keyboard = new Keyboard();
  stopEndSounds();
  SoundManager.sounds.background.currentTime = 0;
  SoundManager.sounds.background.play();
  init();
}

function backToHome() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("fullscreenBtn").style.display = "none";
  document.getElementById("muteBtn").style.display = "none";
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = true;
  }

  if (e.key === "ArrowRight") {
    keyboard.RIGHT = true;
  }

  if (e.key === "ArrowUp") {
    keyboard.UP = true;
  }

  if (e.key === "ArrowDown") {
    keyboard.DOWN = true;
  }

  if (e.key === " ") {
    keyboard.SPACE = true;
    SoundManager.sounds.jump.play();
    SoundManager.sounds.jump.volume = 0.2;
  }

  if (e.key.toLowerCase() === "d") {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    keyboard.LEFT = false;
  }

  if (e.key === "ArrowRight") {
    keyboard.RIGHT = false;
  }

  if (e.key === "ArrowUp") {
    keyboard.UP = false;
  }

  if (e.key === "ArrowDown") {
    keyboard.DOWN = false;
  }

  if (e.key === " ") {
    keyboard.SPACE = false;
  }

  if (e.key.toLowerCase() === "d") {
    keyboard.D = false;
  }
});

document.getElementById("current-year").textContent = new Date().getFullYear();

function toggleFullscreen() {
  let fullscreenElement = document.getElementById("gameContainer");

  if (!document.fullscreenElement) {
    enterFullscreen(fullscreenElement);
  } else {
    exitFullscreen();
  }
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function stopEndSounds() {
  SoundManager.sounds.win.pause();
  SoundManager.sounds.win.currentTime = 0;
  SoundManager.sounds.lose.pause();
  SoundManager.sounds.lose.currentTime = 0;
}

function updateMuteIcon() {
  document.getElementById("muteBtn").innerHTML = SoundManager.muted
    ? "🔇"
    : "🔊";
}

function toggleSound() {
  SoundManager.toggleMute();
  updateMuteIcon();
}

updateMuteIcon();


window.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    world.togglePause();
  }
});


document.querySelectorAll(".touch_controls button").forEach((btn) => {
  const key = btn.dataset.key;
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard[key] = true;
  });
  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard[key] = false;
  });
});