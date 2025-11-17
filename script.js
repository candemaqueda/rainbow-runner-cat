// =========================
// CONFIGURACIÓN DEL JUEGO
// =========================

// Estados
let gameRunning = false;
let score = 0;

// Física (unidades por segundo)
let gravity = -2600;      // gravedad hacia abajo
let jumpStrength = 900;   // fuerza de salto
let velocity = 0;         // velocidad vertical (px/segundo)

// Velocidad del obstáculo (px/segundo)
let obstacleSpeed = 360;  // dificultad intermedia

// Control de tiempo (para deltaTime)
let lastTime = null;
let frameId = null;

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

// Posiciones
let obstacleX = 0;
let gameWidth = 800;

// =========================
// INICIO / RESET DEL JUEGO
// =========================

// Listeners de botones
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

function startGame() {
  // pantallas
  welcomeScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  gameWrapper.style.display = "flex";

  // estado
  gameRunning = true;
  score = 0;
  velocity = 0;
  scoreDisplay.textContent = "Score: 0";

  // ancho real del área de juego
  const rect = gameArea.getBoundingClientRect();
  gameWidth = rect.width || 800;

  // posiciones iniciales
  cat.style.bottom = "0px";
  obstacleX = gameWidth + 80;
  obstacle.style.left = obstacleX + "px";

  lastTime = null;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(loop);
}

function resetGame() {
  // detener animación
  gameRunning = false;
  if (frameId) cancelAnimationFrame(frameId);

  // volver a pantalla de inicio
  gameOverScreen.style.display = "none";
  gameWrapper.style.display = "none";
  welcomeScreen.style.display = "flex";

  // reset visual básico
  cat.style.bottom = "0px";
  obstacle.style.left = "100%";
  velocity = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
}

// =========================
// CONTROLES
// =========================

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (gameRunning) {
      jump();
    }
  }
});

gameArea.addEventListener("pointerdown", () => {
  if (gameRunning) {
    jump();
  }
});

// =========================
// FÍSICA DEL SALTO
// =========================

function jump() {
  // solo salta si está prácticamente en el piso
  const catBottom = parseFloat(window.getComputedStyle(cat).bottom);
  if (catBottom <= 2) {
    velocity = jumpStrength;
  }
}

// =========================
// GAME LOOP CON DELTATIME
// =========================

function loop(timestamp) {
  if (!gameRunning) return;

  if (lastTime === null) {
    lastTime = timestamp;
    frameId = requestAnimationFrame(loop);
    return;
  }

  const deltaTime = (timestamp - lastTime) / 1000; // en segundos
  lastTime = timestamp;

  update(deltaTime);
  frameId = requestAnimationFrame(loop);
}

// =========================
// UPDATE POR FRAME
// =========================

function update(deltaTime) {
  // ---- Movimiento vertical del gato ----
  let catBottom = parseFloat(window.getComputedStyle(cat).bottom);

  // actualizar velocidad y posición
  velocity += gravity * deltaTime;
  catBottom += velocity * deltaTime;

  // no caer por debajo del piso
  if (catBottom < 0) {
    catBottom = 0;
    velocity = 0;
  }

  cat.style.bottom = catBottom + "px";

  // ---- Movimiento del obstáculo ----
  let obstacleLeft = parseFloat(window.getComputedStyle(obstacle).left);

  obstacleLeft -= obstacleSpeed * deltaTime;

  // si salió de pantalla, reset y sumar score
  if (obstacleLeft < -40) {
    obstacleLeft = gameWidth + 80 + Math.random() * 200;
    score++;
    scoreDisplay.textContent = "Score: " + score;

    // subir dificultad cada 4 puntos
    if (score % 4 === 0) {
      obstacleSpeed += 40;
    }
  }

  obstacle.style.left = obstacleLeft + "px";

  // ---- Colisión ----
  if (isCollision(cat, obstacle)) {
    gameOver();
  }
}

// =========================
// DETECCIÓN DE COLISIÓN
// =========================

function isCollision(catEl, obstacleEl) {
  const rawCatRect = catEl.getBoundingClientRect();
  const obsRect = obstacleEl.getBoundingClientRect();

  // achicar un poco el hitbox del gatito para que sea más jugable
  const inset = 10;
  const catRect = {
    top: rawCatRect.top + inset,
    bottom: rawCatRect.bottom - inset,
    left: rawCatRect.left + inset,
    right: rawCatRect.right - inset
  };

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

  // mostrar pantalla de fin
  gameOverScreen.style.display = "flex";
  finalScore.textContent = score;

  if (frameId) cancelAnimationFrame(frameId);
}