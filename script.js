// Referencias a elementos HTML del juego
const game = document.getElementById("game");
const gameWrapper = document.querySelector(".game-wrapper");
const cat = document.getElementById("cat");
const obstacle = document.getElementById("obstacle");
const scoreEl = document.getElementById("score");
const welcomeScreen = document.getElementById("welcomeScreen");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = gameOverEl.querySelector(".final-score");
const restartBtn = document.getElementById("restartBtn");
const startBtn = document.getElementById("startBtn");

// Variables del juego
let isPlaying = false;
let catY = 0;
let velocityY = 0;
const gravity = 0.6;
const jumpForce = 11;

let obstacleX = 800;
const gameWidth = 800;
let gameSpeed = 5; // dificultad intermedia
let score = 0;
let frameId;

// Reiniciar juego
function resetGame() {
  isPlaying = false;
  catY = 0;
  velocityY = 0;
  obstacleX = gameWidth + 40;
  gameSpeed = 5;
  score = 0;

  scoreEl.textContent = "Score: 0";
  cat.style.transform = "translateY(0px)";
  obstacle.style.left = obstacleX + "px";

  welcomeScreen.style.display = "flex";
  gameWrapper.style.display = "none";
  gameOverEl.classList.remove("show");

  cancelAnimationFrame(frameId);
}

// Iniciar juego
function startGame() {
  if (isPlaying) return;
  isPlaying = true;

  welcomeScreen.style.display = "none";
  gameWrapper.style.display = "flex";
  gameOverEl.classList.remove("show");

  score = 0;
  obstacleX = gameWidth + 40;
  gameSpeed = 5;

  update();
}

// Saltar
function jump() {
  if (catY < 5) {
    velocityY = jumpForce;
  }
}

// Loop principal
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
  if (obstacleX < -60) {
    obstacleX = gameWidth + Math.random() * 350;
    score++;
    scoreEl.textContent = "Score: " + score;

    if (score % 4 === 0) {
      gameSpeed += 0.35; // velocidad aumenta gradual
    }
  }

  obstacle.style.left = obstacleX + "px";

  // Colisión
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

// Game Over
function handleGameOver() {
  isPlaying = false;
  finalScoreEl.textContent = "Score final: " + score;
  gameOverEl.classList.add("show");
  cancelAnimationFrame(frameId);
}

// Controles
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    jump();
  }
});

game.addEventListener("pointerdown", () => jump());

restartBtn.addEventListener("click", resetGame);

startBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

// Estado inicial
resetGame();