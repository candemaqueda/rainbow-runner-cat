// =========================
// CONFIGURACIÓN DEL JUEGO
// =========================

// Estados
let gameRunning = false;
let gravity = 0.6;
let jumpStrength = 12;
let velocity = 0;
let score = 0;
let obstacleSpeed = 6; // dificultad intermedia

// Elementos del DOM
const welcomeScreen = document.getElementById("welcomeScreen");
const gameWrapper = document.querySelector(".game-wrapper");
const gameArea = document.getElementById("game");
const cat = document.getElementById("cat");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const startBtn = document.getElementById("startButton");
const restartBtn = document.getElementById("restartButton");

// =========================
// INICIO DEL JUEGO
// =========================
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

function startGame() {
  welcomeScreen.style.display = "none";
  gameWrapper.style.display = "flex";
  gameRunning = true;
  animate();
}

function resetGame() {
  gameOverScreen.style.display = "none";
  welcomeScreen.style.display = "flex";
  cat.style.bottom = "0px";
  obstacle.style.left = "100%";
  velocity = 0;
  score = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameRunning) {
    jump();
  }
});

// =========================
// FÍSICA DEL SALTO
// =========================
function jump() {
  velocity = jumpStrength;
}

// =========================
// LOOP PRINCIPAL
// =========================
function animate() {
  if (!gameRunning) return;

  // Movimiento vertical del gato
  let catBottom = parseInt(window.getComputedStyle(cat).bottom);
  velocity -= gravity;
  cat.style.bottom = Math.max(0, catBottom + velocity) + "px";

  // Movimiento del obstáculo
  let obstacleLeft = parseInt(window.getComputedStyle(obstacle).left);
  if (obstacleLeft < -40) {
    obstacle.style.left = "100%";
    score++;
    scoreDisplay.textContent = score;
  } else {
    obstacle.style.left = obstacleLeft - obstacleSpeed + "px";
  }

  // Colisión
  if (isCollision(cat, obstacle)) {
    gameOver();
    return;
  }

  requestAnimationFrame(animate);
}

// =========================
// DETECCIÓN DE COLISIÓN
// =========================
function isCollision(cat, obstacle) {
  const catRect = cat.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();

  return !(
    catRect.bottom < obsRect.top ||
    catRect.top > obsRect.bottom ||
    catRect.right < obsRect.left ||
    catRect.left > obsRect.right
  );
}

// =========================
// GAME OVER
// =========================
function gameOver() {
  gameRunning = false;
  gameOverScreen.style.display = "flex";
  finalScore.textContent = score;
}