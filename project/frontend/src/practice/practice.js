import { resetGame, handleStartGame } from "./gameLogic.js";
import { getIsRunning, setIsRunning } from "./utils.js";
export function getCanvas() {
	const canvas = document.getElementById('pong');
	if (!canvas) {
		throw new Error("Canvas element not found. Make sure the DOM is loaded.");
	}
	return canvas;
}

export function getContext() {
	return getCanvas().getContext('2d');
}

export function openPracticeTab() {
	const buttonStart = document.getElementById("startGame");
	const buttonStop = document.getElementById("stopGame");
	const gameOptions = document.getElementById("options");
	const stopOptions = document.getElementById("stop");
	resetGame();
	buttonStart.addEventListener("click", () => {
		const counter = parseInt(document.getElementById("ballCount").value);
		gameOptions.style.display = "none";
		stopOptions.style.display = "block";
		handleStartGame(counter);
	});
	buttonStop.addEventListener("click", () => {
		gameOptions.style.display = "flex";
		stopOptions.style.display = "none";
		resetGame();
	});
}

function cleanUp() {
	const gameOptions = document.getElementById("options");
	const stopOptions = document.getElementById("stop");
	gameOptions.style.display = "flex";
	stopOptions.style.display = "none";
	resetGame();
	setIsRunning(false);
}

window.addEventListener('hashchange', function (event) {
	if (getIsRunning()) {
		cleanUp();
	}
});

window.addEventListener('beforeunload', function (event) {
	if (getIsRunning()) {
		cleanUp();
	}
});
