import { getRandomColor, getRandomDirection } from "./utils.js";
import { Ball, Paddle } from "./gameClass.js";
import { getCanvas, getContext, cleanUp } from "./practice.js";
import {movePaddles} from "./controls.js";
import { updateGameStatus, getIsRunning, setIsRunning } from "./utils.js";
import { player1Name, player2Name, addPlayersNames } from "./utils.js";




const canvas = getCanvas(); 
const context = getContext();
let rgbColor = "white";
let animationId = null;
let balls = [];
let maxScore = 3;
export let leftPlayerScore = 0;
export let rightPlayerScore = 0;
let winner = null;
let loser = null;

export let leftPaddle = new Paddle(0);
export let rightPaddle = new Paddle(canvas.width - 10);


function showWinner(name) {
  const banner = document.getElementById("winnerBanner");
  const winnerName = document.getElementById("winnerName");
  winnerName.textContent = name;
  banner.classList.remove("hidden");

  setTimeout(() => {
    banner.classList.add("hidden");
  }, 4000);
}

function createBall(dirX, dirY, ballColor) {
	let ball = new Ball(dirX, dirY, ballColor);
	console.log("The ball is created: ", dirX, dirY, ballColor);
	balls.push(ball);
}

function checkBall(ball) {
	// Top/bottom wall collision
	if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
		ball.speedY = -ball.speedY;
	}
	// Left paddle collision
	if (ball.x <= leftPaddle.x + leftPaddle.width &&
		ball.y + ball.size >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
		ball.x = leftPaddle.x + leftPaddle.width;
		ball.speedX = -ball.speedX;
	}
	// Right paddle collision
	if (ball.x + ball.size >= rightPaddle.x &&
		ball.x <= rightPaddle.x + rightPaddle.width &&
		ball.y + ball.size >= rightPaddle.y &&
		ball.y <= rightPaddle.y + rightPaddle.height) {
		ball.x = rightPaddle.x - ball.size;
		ball.speedX = -ball.speedX;
	}
	if (ball.x <= 0) {
		rightPlayerScore++;
		ball.reset();
	}
	if (ball.x + ball.size >= canvas.width) {
		leftPlayerScore++;
		console.log("leftPlayerScore", leftPlayerScore);
		ball.reset();
	}
}

function gameLoop() {
	context.clearRect(0, 0, canvas.width, canvas.height);
    console.log( "In the loop")
	movePaddles();
	leftPaddle.drawPaddle();
	rightPaddle.drawPaddle();
	for (const ball of balls) {
		ball.update();
		console.log("Speed: ", ball.dirX, ball.dirY)
		ball.drawBall();
		checkBall(ball);
	}
	updateGameStatus();
	if (leftPlayerScore >= maxScore || rightPlayerScore >= maxScore) {
		if (leftPlayerScore >= maxScore) {
			winner = player1Name;
			loser = player2Name;
		} else {
			winner = player2Name;
			loser = player1Name;

		}
		// // showModal();
		showWinner(winner);
        cleanUp();
		// sendGameResults(winner, loser);
		return;
	}
	animationId = requestAnimationFrame(gameLoop);
}

export function handleStartGame(counter) {
    if (getIsRunning()) return;
    setIsRunning(true)
	addPlayersNames();
    const ballCount = counter || 1;
    balls = [];
    if (ballCount === 1)
        createBall(1, 1, rgbColor);
    else {
        if (ballCount > 2)
            maxScore = 30;
        for (let i = 0; i < ballCount; i++) {
            rgbColor = getRandomColor();
            const dirX = getRandomDirection();
            const dirY = getRandomDirection();
            createBall(dirX, dirY, rgbColor);
        }
    }
    gameLoop();
}

export function resetGame() {
	if (animationId !== null) {
		cancelAnimationFrame(animationId);
		setIsRunning(false);
	}
    context.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById("players").innerHTML = "";
	document.getElementById("gameStatusFrontend").innerHTML = "0 - 0";
	balls = [];
	rgbColor = "white";
	animationId = null;
	winner = ""
	leftPlayerScore = 0;
	rightPlayerScore = 0;
	maxScore = 3;
    leftPaddle = new Paddle(0);
    rightPaddle = new Paddle(canvas.width - 10);
}
