// import ActivityManager from "../managers/activityManager.js";
import { getCanvas, getContext } from "./practice.js";

const canvas = getCanvas(); 
const context = getContext();


export class Balls {
    constructor(dirX, dirY, ballColor) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = dirX;
        this.speedY = dirY;
        this.size = 20;
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
        console.log("Speed in reset  ", this.speedX);
    }
}

export class Paddle {
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
};
