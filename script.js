// Referencias a elementos HTML del juego
const game = document.getElementById("game");
const cat = document.getElementById("cat");
const obstacle = document.getElementById("obstacle");
const scoreEl = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = gameOverEl.querySelector(".final-score");
const restartBtn = document.getElementById("restartBtn");

// Variables para controlar el estado del juego y la física del salto
let isPlaying = false;
let catY = 0;          // desplazamiento vertical en px
let velocityY = 0;
const gravity = 0.6;
const jumpForce = 11;

// Variables para el movimiento del obstáculo y el puntaje
let obstacleX = 800;
const gameWidth = 800;
let gameSpeed = 6;
let score = 0;
let frameId;

// Función para reiniciar el juego a su estado inicial
function resetGame() {
  isPlaying = false;
  catY = 0;
  velocityY = 0;
  obstacleX = gameWidth + 20;
  gameSpeed = 6;
  score = 0;
  scoreEl.textContent = "Score: 0";
  cat.style.transform = "translateY(0)";
  obstacle.style.left = obstacleX + "px";
  startScreen.classList.add("show");
  gameOverEl.classList.remove("show");
  cancelAnimationFrame(frameId);
}

// Función para iniciar el juego y comenzar la actualización del estado
function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  startScreen.classList.remove("show");
  gameOverEl.classList.remove("show");
  score = 0;
  obstacleX = gameWidth + 20;
  gameSpeed = 6;
  update();
}

// Función que maneja el salto del gato, iniciando el juego si no está en curso
function jump() {
  if (!isPlaying) {
    startGame();
  }
  // solo dejamos saltar si está cerca del piso
  if (catY < 5) {
    velocityY = jumpForce;
  }
}

// Función principal que actualiza la física del salto, movimiento del obstáculo, detección de colisiones y puntaje
function update() {
  // Física del salto
  velocityY -= gravity;
  catY += velocityY;
  if (catY < 0) {
    catY = 0;
    velocityY = 0;
  }
  cat.style.transform = `translateY(${-catY}px)`;

  // Movimiento del obstáculo
  obstacleX -= gameSpeed;
  if (obstacleX < -40) {
    obstacleX = gameWidth + Math.random() * 300;
    score++;
    scoreEl.textContent = "Score: " + score;
    // aumenta un poco la velocidad cada 5 puntos
    if (score % 5 === 0) {
      gameSpeed += 0.8;
    }
  }
  obstacle.style.left = obstacleX + "px";

  // Detección de colisión
  const catRect = cat.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();

  const isColliding =
    catRect.right > obsRect.left &&
    catRect.left < obsRect.right &&
    catRect.bottom > obsRect.top &&
    catRect.top < obsRect.bottom;

  if (isColliding) {
    handleGameOver();
    return;
  }

  frameId = requestAnimationFrame(update);
}

// Función que maneja lo que ocurre cuando termina el juego por colisión
function handleGameOver() {
  isPlaying = false;
  finalScoreEl.textContent = "Score final: " + score;
  gameOverEl.classList.add("show");
  cancelAnimationFrame(frameId);
}

// Controles: teclado y touch para manejar el salto y reinicio del juego
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    jump();
  }
});

game.addEventListener("pointerdown", () => {
  jump();
});

restartBtn.addEventListener("click", resetGame);

// Arranca en estado esperando
resetGame();