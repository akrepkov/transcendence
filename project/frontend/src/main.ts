import { handleRegister } from './register/register.js';
import { handleLogin } from './login/login.js';
import { toggleForms } from './toggle/toggleForms.js';
import { renderGame } from './game_new/render.js';

handleRegister();
handleLogin();
toggleForms();

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('snake') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas element not found');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D rendering context');
  }
  const socket = new WebSocket(`wss://${window.location.hostname}:3000/ws/connect`);
  setupSocketEvents(socket);
  renderGame(ctx, socket);
});

export function setupSocketEvents(socket: WebSocket) {
  socket.onopen = () => {
    console.log('WebSocket connection opened.');
    const start = document.getElementById('start-button');
    if (!start) {
      throw new Error('Start button element not found');
    }
    start.addEventListener('click', () => {
      socket.send(JSON.stringify({ type: 'joinWaitingRoom' }));
    });
  };
  socket.onerror = function (error) {
    console.error('WebSocket error:', error);
  };
  socket.onclose = function () {
    console.log('WebSocket connection closed.');
  };
}
