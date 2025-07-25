import { handleRegister, handleLogin } from './auth/auth.js';
import { toggleForms } from './toggle/toggleForms.js';
import { renderGame } from './game_new/render.js';
import { setupSocketEvents } from './game_new/websocket.js';

handleLogin();
handleRegister();
toggleForms();

document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket(`wss://${window.location.hostname}/ws/connect`);
  setupSocketEvents(socket);
  renderGame(socket);
});

//Anna TODO add port to frontend websocket
//uncomment cert in index.js
