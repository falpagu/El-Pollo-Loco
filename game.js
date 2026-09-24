let canvas;
let world;
let keyboard = new Keyboard();

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("fullscreenBtn").style.display = "flex";
  SoundManager.sounds.background.loop = true;
  SoundManager.sounds.background.volume = 0.02;
  SoundManager.sounds.background.play();
  init();
}

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
    SoundManager.sounds.throw.play(); 
    SoundManager.sounds.throw.volume = 0.2;
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
  let fullscreenElement = document.getElementById("canvas");

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
  } else if(document.webkitRequestFullscreen) {
    document.webkitRequestFullscreen();
  }
}

