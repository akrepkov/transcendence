var canvas = document.getElementById('pong');
var context = canvas.getContext('2d');
const keys = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false,
};
let balls = [];
let red= " ";
let green = '';
let blue = '';
let rgbColor = "white";
let animationId = null;
let names1 = ["NullPointerPrince", "404NotFoundYou", "StackOverflowed",
	"CtrlAltElite", "CommitCrimes", "RubberDuckieDev", "PingMePlz", "BrbCompiling", "FatalSyntax",
	"BuggedButHappy", "InfiniteLoopHole", "SegFaultyLogic", "ByteMeMaybe", "SpaghettiCoder",
	"FullSnackDev", "KernelSandwich", "BoolinDev", "NaNStopper", "DevNullius",
	"TabbyTheDebugger", "LootBoxLad", "NoScopeCSharp", "Lagzilla", "RespawnResume", "CacheMeOutside"];
let names2 = ["AimBotany", "CrashTestCutie", "YeetCompiler",
	"PixelPuncher", "AFKChef", "TeaBagger3000", "CaffeineLoop", "RAMenNoodles",
	"404SnaccNotFound", "HelloWorldDomination", "JavaTheHutt",
	"WiFried", "DebuggerDuck", "ExceptionHunter", "TheRealSlimShader",
	"SyntaxTerror", "ClickyMcClickface", "BananaForScale", "Devzilla",
	"MrRobotoCallsHome", "SudoNym", "OopsIDidItAgain", "MemeDrivenDev",
	"TypoNinja", "BitFlipper"];
const randomIndex = Math.floor(Math.random() * names1.length);
let player1Name = names1[randomIndex];
let player2Name = names2[randomIndex];
let leftPlayerScore = 0;
let rightPlayerScore = 0;
let maxScore = 3;
export function openPracticeTab() {
	const buttonStart = document.getElementById("startGame");
	const buttonStop = document.getElementById("stopGame");
	const gameOptions = document.getElementById("options");

	buttonStart.addEventListener("click", () => {
		const counter = parseInt(document.getElementById("ballCount").value);
		gameOptions.style.display = "none";
		buttonStop.style.display = "block";
		handleStartGame(counter);
	});
	buttonStop.addEventListener("click", () => {
		gameOptions.style.display = "block";
		buttonStop.style.display = "none";
		handleStopGame();
	});
}


class Ball {
	constructor(dirX, dirY, ballColor) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = dirX;
		this.speedY = dirY;
		this.size = 10;
		this.color = ballColor;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	drawBall() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.size, this.size);
	}
	reset() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = -this.speedX;
	}
}

class Paddle {
	constructor(x) {
		this.height = 100;
		this.width = 10;
		this.x = x;
		this.y = (canvas.height - this.height) / 2;
		this.paddleSpeed = 10;
	}
	drawPaddle() {
		context.fillStyle = 'white';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

// let ball = new Ball(1, 1, "red");

let leftPaddle = new Paddle(0);
let rightPaddle = new Paddle(canvas.width - 10);


function createBall(dirX, dirY, ballColor) {
	let ball = new Ball(dirX, dirY, ballColor);
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
		ball.reset();
	}
}

function updateGameStatus() {
	const gameStatusDiv = document.getElementById('gameStatus');
	gameStatusDiv.innerHTML = `${player1Name}   ${leftPlayerScore} - ${rightPlayerScore}   ${player2Name}`;
}

function movePaddles() {
	if (keys.w && leftPaddle.y > 0) {
		leftPaddle.y -= leftPaddle.paddleSpeed;
	}
	if (keys.s && leftPaddle.y + leftPaddle.height < canvas.height) {
		leftPaddle.y += leftPaddle.paddleSpeed;
	}
	if (keys.ArrowUp && rightPaddle.y > 0) {
		rightPaddle.y -= rightPaddle.paddleSpeed;
	}
	if (keys.ArrowDown && rightPaddle.y + rightPaddle.height < canvas.height) {
		rightPaddle.y += rightPaddle.paddleSpeed;
	}
}

document.addEventListener('keydown', (event) => {
	if (event.key in keys) {
		keys[event.key] = true;
	}
});
document.addEventListener('keyup', (event) => {
	if (event.key in keys) {
		keys[event.key] = false;
	}
})

function gameLoop() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	movePaddles();
	leftPaddle.drawPaddle();
	rightPaddle.drawPaddle();
	for (const ball of balls) {
		ball.update();
		ball.drawBall();
		checkBall(ball);
	}
	updateGameStatus();
	if (leftPlayerScore >= maxScore || rightPlayerScore >= maxScore) { //add winner here
		showModal();
		cancelAnimationFrame(animationId);
		return;
	}
	animationId = requestAnimationFrame(gameLoop);
}

function getRandomColor() {
	return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

function getRandomDirection() {
	const directionSign = Math.random() > 0.5 ? -1 : 1;
	return (Math.floor(Math.random() * 90) + 20) / 100 * directionSign;
}

function showModal(){
	console.log("Showing modal");
	const modal = document.getElementById("myModal");
	modal.style.display = "flex";
}

let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("click", () => {
	const modal = document.getElementById("myModal"); 
	modal.style.display = "none";
});

function handleStartGame(counter) {
	console.log("ball ", counter);
	const ballCount = counter || 1;
	balls = [];
	if (ballCount === 1)
		createBall(1, 1, rgbColor);
	else {
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

function handleStopGame() {
	console.log('Stopping game');
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}
	for (const ball of balls)
		ball.reset();
	leftPlayerScore = 0;
	rightPlayerScore = 0;
	maxScore = 3;
	updateGameStatus();
	context.clearRect(0, 0, canvas.width, canvas.height);
}
