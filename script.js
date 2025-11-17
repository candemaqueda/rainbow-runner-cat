// =======================================
// ELEMENT REFERENCES
// =======================================
const game = document.getElementById("game");
const gameWrapper = document.querySelector(".game-wrapper");
const cat = document.getElementById("cat");
const obstacle = document.getElementById("obstacle");
const scoreEl = document.getElementById("score");

const welcomeScreen = document.getElementById("welcomeScreen");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.querySelector(".final-score");

const startBtn = document.getElementById("startButton");
const restartBtn = document.getElementById("restartButton");

// =======================================
// GAME STATE VARIABLES
// =======================================
let isPlaying = false;
let score = 0;

let catY = 0;
let velocityY = 0;

const gravity = 0.6;
const jumpForce = 11;

let obstacleX = 800;
const gameWidth = 800;
let gameSpeed = 5;

let frameId;

// =======================================
// RESET GAME
// =======================================
function resetGame() {
  cancelAnimationFrame(frameId);

  isPlaying = false;
  score = 0;
  catY = 0;
  velocityY = 0;

  scoreEl.textContent = "Score: 0";
  cat.style.transform = "translateY(0px)";

  obstacleX = gameWidth + 60;
  obstacle.style.left = `${obstacleX}px`;

  gameOverEl.classList.remove("show");
  gameWrapper.style.display = "none";
  welcomeScreen.style.display = "flex";
}

// =======================================
// START GAME
// =======================================
function startGame() {
  if (isPlaying) return;

  isPlaying = true;
  score = 0;
  gameSpeed = 5;

  welcomeScreen.style.display = "none";
  gameOverEl.classList.remove("show");
  gameWrapper.style.display = "flex";

  update();
}

// =======================================
// JUMP FUNCTION
// =======================================
function jump() {
  if (catY < 5) velocityY = jumpForce;
}

// =======================================
// MAIN GAME LOOP
// =======================================
function update() {
  // Apply gravity
  velocityY -= gravity;
  catY += velocityY;

  // Floor limit
  if (catY < 0) {
    catY = 0;
    velocityY = 0;
  }

  cat.style.transform = `translateY(${-catY}px)`;

  // Move obstacle
  obstacleX -= gameSpeed;

  if (obstacleX < -80) {
    obstacleX = gameWidth + Math.random() * 350;
    score++;
    scoreEl.textContent = `Score: ${score}`;

    if (score % 4 === 0) gameSpeed += 0.4;
  }

  obstacle.style.left = `${obstacleX}px`;

  // Collision detection
  const catRect = cat.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();

  const colliding =
    catRect.right > obsRect.left &&
    catRect.left < obsRect.right &&
    catRect.bottom > obsRect.top &&
    catRect.top < obsRect.bottom;

  if (colliding) {
    handleGameOver();
    return;
  }

  frameId = requestAnimationFrame(update);
}

// =======================================
// GAME OVER HANDLER
// =======================================
function handleGameOver() {
  cancelAnimationFrame(frameId);
  isPlaying = false;

  finalScoreEl.textContent = `Score final: ${score}`;
  gameOverEl.classList.add("show");
}

// =======================================
// CONTROLS
// =======================================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    jump();
  }
});

game.addEventListener("pointerdown", () => jump());

// =======================================
// BUTTON EVENTS
// =======================================
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

// =======================================
// INITIALIZE
// =======================================
resetGame();