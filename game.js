/**
 * The game canvas element. Set in {@link init}.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The current game world. Recreated on every start/restart.
 * @type {World}
 */
let world;

/**
 * Shared keyboard state. Replaced with a new instance on restart.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Starts the game in fullscreen mode when the player clicks Play.
 * Hides the start screen, shows the gamecontrols, starts the background music
 * and initializes the world.
 *
 * @returns {void}
 */
function startGame() {
  document.activeElement.blur();
  document.getElementById("touchControls").classList.add("visible");
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("fullscreenBtn").style.display = "flex";
  document.getElementById("muteBtn").style.display = "block";
  document.getElementById("pauseBtn").style.display = "block";
  SoundManager.play("background");
  init();
}

/**
 * Creates a fresh level and a new world. Used by {@link startGame}
 * and {@link restartGame}.
 *
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("canvas");
  initLevel();
  world = new World(canvas, keyboard);
}

/**
 * Stops the running game: clears all intervals, cancels the animation
 * frame and pauses the walking and chicken sounds.
 *
 * @returns {void}
 */
function stopGame() {
  const last = setInterval(() => {}, 100000);
  for (let i = 0; i <= last; i++) clearInterval(i);
  cancelAnimationFrame(world.animationFrame);
  SoundManager.sounds.walk.pause();
  SoundManager.sounds.chicken.pause();
  SoundManager.sounds.smallChicken.pause();
  SoundManager.sounds.sleep.pause();
}

/**
 * Ends the game: stops everything, plays the win or lose sound
 * and shows the end screen.
 *
 * @param {boolean} won - True if the player won, false if the player lost.
 * @returns {void}
 */
function endGame(won) {
  stopGame();
  SoundManager.sounds.background.pause();
  SoundManager.sounds.bossWalk.pause();
  SoundManager.play(won ? "win" : "lose");
  document.getElementById("endImage").src = won
    ? "./assets/img/You won, you lost/You Won B.png"
    : "./assets/img/You won, you lost/You lost.png";
  document.getElementById("endScreen").style.display = "flex";
}

/**
 * Restarts the game without reloading the page: hides the end screen,
 * resets the keyboard, stops the end sounds, restarts the background
 * music and creates a new level and world.
 *
 * @returns {void}
 */
function restartGame() {
  document.getElementById("endScreen").style.display = "none";
  keyboard = new Keyboard();
  stopEndSounds();
  SoundManager.play("background");
  init();
}

/**
 * Returns from the end screen to the start screen and hides
 * the fullscreen and mute buttons.
 *
 * @returns {void}
 */
function backToHome() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("fullscreenBtn").style.display = "none";
  document.getElementById("muteBtn").style.display = "none";
  document.getElementById("touchControls").classList.remove("visible");
  document.getElementById("pauseBtn").style.display = "none";
}

/**
 * Sets the matching keyboard flag to true when a game key is pressed.
 * Prevents the default space bar behavior and handles fullscreen activation.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
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
    e.preventDefault();
    keyboard.SPACE = true;
  }

  if (e.key.toLowerCase() === "d") {
    keyboard.D = true;
  }

  if (e.key.toLowerCase() === "f" && !e.repeat) {
    toggleFullscreen();
  }
});

/**
 * Sets the matching keyboard flag to false when a game key is released.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
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

/**
 * Switches the game container between fullscreen and normal mode.
 *
 * @returns {void}
 */
function toggleFullscreen() {
  document.activeElement.blur();
  let fullscreenElement = document.getElementById("gameContainer");

  if (!document.fullscreenElement) {
    enterFullscreen(fullscreenElement);
  } else {
    exitFullscreen();
  }
}

/**
 * Requests fullscreen for an element (with a WebKit fallback).
 *
 * @param {HTMLElement} element - Element to show in fullscreen.
 * @returns {Promise<void>|void}
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  }
}

/**
 * Leaves fullscreen mode (with a WebKit fallback).
 *
 * @returns {void}
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Stops the win and lose sounds and resets them to the beginning.
 *
 * @returns {void}
 */
function stopEndSounds() {
  SoundManager.sounds.win.pause();
  SoundManager.sounds.win.currentTime = 0;
  SoundManager.sounds.lose.pause();
  SoundManager.sounds.lose.currentTime = 0;
}

/**
 * Updates the mute button icon to match the current mute state.
 *
 * @returns {void}
 */
function updateMuteIcon() {
  document.getElementById("muteBtn").innerHTML = SoundManager.muted
    ? "🔇"
    : "🔊";
}

/**
 * Toggles the mute state of all sounds and updates the icon.
 *
 * @returns {void}
 */
function toggleSound() {
  document.activeElement.blur();
  SoundManager.toggleMute();
  updateMuteIcon();
}

updateMuteIcon();

/**
 * Toggles pause and updates the pause button icon.
 *
 * @returns {void}
 */
function togglePause() {
  document.activeElement.blur();
  if (!world) return;
  world.togglePause();
  updatePauseIcon();
}

/**
 * Shows the play icon while paused and the pause icon while running.
 *
 * @returns {void}
 */
function updatePauseIcon() {
  document.getElementById("pauseBtn").innerHTML =
    world && world.isPaused ? "▶️" : "⏸️";
}

/**
 * Toggles pause when the Escape key is pressed.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && !e.repeat) togglePause();
});

/**
 * Connects the on-screen touch buttons to the keyboard state.
 * Touch start sets the key flag to true, touch end sets it to false.
 * The key name comes from the button's `data-key` attribute.
 *
 * @returns {void}
 */
document.querySelectorAll(".touch_controls button").forEach((btn) => {
  const key = btn.dataset.key;
  const press = (e) => {
    e.preventDefault();
    if (world && world.isPaused) return;
    keyboard[key] = true;
  };
  const release = (e) => {
    e.preventDefault();
    keyboard[key] = false;
  };
  btn.addEventListener("touchstart", press);
  btn.addEventListener("touchend", release);
  btn.addEventListener("touchcancel", release);
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
});
