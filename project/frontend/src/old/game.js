/**
 *
 * Solutions for starting a game for unregistered users, saving in database just by username
 * Not using!
 */
let player1Name = '';
let player2Name = '';
let animationId = null;

// Called when the Game tab is opened
export function openGameTab() {
  const buttonStart = document.getElementById('startGame');

  if (buttonStart) {
    buttonStart.addEventListener('click', handleStartGame);
  } else {
    console.warn('Start Game button not found!');
  }
}

// Called ONLY when button is clicked
function handleStartGame() {
  const input1 = document.getElementById('player1');
  const input2 = document.getElementById('player2');

  player1Name = input1?.value.trim() || 'Player 1';
  player2Name = input2?.value.trim() || 'Player 2';

  if (player1Name === player2Name) {
    alert('Player names must be different!');
    return;
  }

  // I am not saving players right now cause we need to think about logic
  //   fetch("/api/players", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ player1: player1Name, player2: player2Name })
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error("Failed to save players");
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Players saved:", data);

  //       // Hide inputs
  input1.classList.add('hidden');
  input2.classList.add('hidden');
  document.getElementById('startGame').classList.add('hidden');

  // Start the game
  startPongGame(player1Name, player2Name);
  // })
  // .catch((error) => {
  //   console.error("Error saving players:", error);
  // });
}

/**
 * The game logic, needs to be written in typescript and without canvas
 */

// Get the canvas and its context
var canvas = document.getElementById('pong');
var context = canvas.getContext('2d');
// Constants for the game
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 100;
var BALL_SIZE = 10;
// Set initial positions for paddles and ball
var leftPaddleY = (HEIGHT - PADDLE_HEIGHT) / 2;
var rightPaddleY = (HEIGHT - PADDLE_HEIGHT) / 2;
var ballX = WIDTH / 2;
var ballY = HEIGHT / 2;
var ballSpeedX = 2;
var ballSpeedY = 2;
var leftPlayerScore = 0;
var rightPlayerScore = 0;
// var player1Name = "";
// var player2Name = "";
// Draw the paddles and the ball
function draw() {
  context.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas
  // Draw paddles
  context.fillStyle = 'white';
  context.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Left paddle
  context.fillRect(WIDTH - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Right paddle
  // Draw the ball
  context.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE); // Ball
}
// Update the ball's position
function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // Collision with top/bottom walls
  if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
    ballSpeedY = -ballSpeedY; // Bounce
  }
  // Collision with paddles
  if (
    (ballX <= PADDLE_WIDTH &&
      ballY + BALL_SIZE > leftPaddleY &&
      ballY < leftPaddleY + PADDLE_HEIGHT) ||
    (ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
      ballY + BALL_SIZE > rightPaddleY &&
      ballY < rightPaddleY + PADDLE_HEIGHT)
  ) {
    ballSpeedX = -ballSpeedX; // Bounce
  }
  // Ball goes out of bounds (left or right)
  if (ballX <= 0) {
    rightPlayerScore++;

    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX = -ballSpeedX; // Change ball direction
  }
  if (ballX + BALL_SIZE >= WIDTH) {
    leftPlayerScore++;

    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballSpeedX = -ballSpeedX; // Change ball direction
  }
}

function updateGameStatus(player1Name, player2Name) {
  var gameStatusDiv = document.getElementById('gameStatus');
  gameStatusDiv.innerHTML = `${player1Name} ${leftPlayerScore} - ${rightPlayerScore} ${player2Name}`;
}
// Control paddles with keyboard (W/S for left paddle, Arrow keys for right paddle)
function movePaddles(event) {
  var paddleSpeed = 10;
  if (event.key === 'w' && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (event.key === 's' && leftPaddleY + PADDLE_HEIGHT < HEIGHT) leftPaddleY += paddleSpeed;
  if (event.key === 'ArrowUp' && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
  if (event.key === 'ArrowDown' && rightPaddleY + PADDLE_HEIGHT < HEIGHT)
    rightPaddleY += paddleSpeed;
}
// Listen for keyboard input
document.addEventListener('keydown', movePaddles);
// Main game loop
function gameLoop() {
  draw();
  updateBall();
  updateGameStatus(player1Name, player2Name);
  if (leftPlayerScore >= 3 || rightPlayerScore >= 3) {
    fetch('api/winner', {
      // Correct route for saving game results
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player1: player1Name,
        player2: player2Name,
        winner: leftPlayerScore >= 3 ? player1Name : player2Name,
      }),
    });
    // Game over condition, stop the game loop
    console.log('Game Over!'); // Placeholder for game over logic
    return;
  }
  requestAnimationFrame(gameLoop); // Request next frame
}
// Start the game
function startPongGame(player1, player2) {
  player1Name = player1 || 'Player 1'; // Default to "Player 1" if no name is provided
  player2Name = player2 || 'Player 2';
  gameLoop(player1, player2);
}

function stopPongGame() {
  console.log('Stopping game');
  if (animationId) {
    cancelAnimationFrame(animationId); // Stop the animation frame
  }
  const canvas = document.getElementById('pong');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
