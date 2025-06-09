export function openConnection() {
  console.log('opening websocket');
  let socket = new WebSocket('wss://localhost:3000/ws/connect');
}
