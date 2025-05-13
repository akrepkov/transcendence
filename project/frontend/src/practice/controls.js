import * as game from './gameLogic.js';
import { getCanvas, getContext } from "./practice.js";

const canvas = getCanvas(); 

const keys = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false,
};
export function movePaddles() {
	if (keys.w && game.leftPaddle.y > 0) {
		game.leftPaddle.y -= game.leftPaddle.paddleSpeed;
	}
	if (keys.s && game.leftPaddle.y + game.leftPaddle.height < canvas.height) {
		game.leftPaddle.y += game.leftPaddle.paddleSpeed;
	}
	if (keys.ArrowUp && game.rightPaddle.y > 0) {
		game.rightPaddle.y -= game.rightPaddle.paddleSpeed;
	}
	if (keys.ArrowDown && game.rightPaddle.y + game.rightPaddle.height < canvas.height) {
		game.rightPaddle.y += game.rightPaddle.paddleSpeed;
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