/* style.css */

/* [no changes to CSS needed here] */

/* script.js */

document.addEventListener("DOMContentLoaded", () => {
  const dot = document.getElementById('dot');
  const scoreEl = document.getElementById('score');
  const timerFill = document.getElementById('timerFill');
  const gameOverScreen = document.getElementById('game-over');
  const finalScoreEl = document.getElementById('final-score');
  const leaderboardEl = document.getElementById('leaderboard');
  const startScreen = document.getElementById('start-screen');

  // Updated working sound URLs
  const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-29.mp3");
  const bombSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
  const gameOverSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

  let score = 0;
  let timeLeft = 30;
  let gameInterval;
  let timerInterval;
  let isGameRunning = false;

  function updateScore() {
    scoreEl.textContent = `Score: ${score}`;
  }

  function updateTimer() {
    timerFill.style.width = `${(timeLeft / 30) * 100}%`;
  }

  function moveDot() {
    if (!isGameRunning) return;
    const x = Math.random() * (window.innerWidth - 80);
    const y = Math.random() * (window.innerHeight - 80);
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    const isBomb = Math.random() < 0.2;
    dot.classList.toggle('bomb', isBomb);

    dot.onclick = () => {
      if (!isGameRunning) return;
      if (isBomb) {
        score = Math.max(0, score - 2);
        bombSound.play();
      } else {
        score++;
        clickSound.play();
      }
      updateScore();
      moveDot();
    };
  }

  function updateLeaderboard(newScore) {
    const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    scores.push(newScore);
    scores.sort((a, b) => b - a);
    const top5 = scores.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(top5));
  }

  function showLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboardEl.innerHTML = scores.map(score => `<li>Score: ${score}</li>`).join('');
  }

  function endGame() {
    isGameRunning = false;
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    dot.classList.add('hidden');
    finalScoreEl.textContent = score;
    updateLeaderboard(score);
    showLeaderboard();
    gameOverSound.play();
    gameOverScreen.classList.remove('hidden');
  }

  window.startGame = function () {
    score = 0;
    timeLeft = 30;
    isGameRunning = true;
    updateScore();
    updateTimer();

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    dot.classList.remove('hidden');

    moveDot();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) endGame();
    }, 1000);

    gameInterval = setInterval(moveDot, 900);
  };

  // Initial state
  dot.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});