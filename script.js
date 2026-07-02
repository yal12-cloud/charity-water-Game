let gameRunning = false;
let dropMaker;
let timerInterval;

let score = 0;
let timeLeft = 30;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");

const winningMessages = [
  "Amazing! You helped collect clean water for communities!",
  "Great work! You are a clean water hero!",
  "You won! Every drop makes an impact!"
];

const losingMessages = [
  "Good try! Every drop still counts.",
  "Try again! You can collect more clean water next time.",
  "Keep going! Communities are counting on clean water heroes."
];

startBtn.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameContainer.innerHTML = "";
  startBtn.textContent = "Game Running...";

  dropMaker = setInterval(createDrop, 700);

  timerInterval = setInterval(function () {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function createDrop() {
  const drop = document.createElement("div");

  const isBadDrop = Math.random() < 0.25;

  if (isBadDrop) {
    drop.className = "water-drop bad-drop";
    drop.textContent = "✖";
  } else {
    drop.className = "water-drop";
    drop.textContent = "💧";
  }

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";
  drop.style.animationDuration = "4s";

  drop.addEventListener("pointerdown", function () {
    if (!gameRunning) return;

    if (isBadDrop) {
      score = Math.max(0, score - 2);
      showMessage("Oh no! Dirty water removed points.");
    } else {
      score++;
      showMessage("+1 clean water drop!");
    }

    scoreDisplay.textContent = score;
    drop.remove();
  });

  gameContainer.appendChild(drop);

  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function showMessage(text) {
  let message = document.getElementById("game-message");

  if (!message) {
    message = document.createElement("p");
    message.id = "game-message";
    document.querySelector(".game-wrapper").appendChild(message);
  }

  message.textContent = text;
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  const win = score >= 20;
  const messages = win ? winningMessages : losingMessages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  if (win) {
    showConfetti();
  }

  showMessage(randomMessage + " Final Score: " + score);
  startBtn.textContent = "Reset / Play Again";
}

function showConfetti() {
  for (let i = 0; i < 25; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.textContent = "🎉";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    gameContainer.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}