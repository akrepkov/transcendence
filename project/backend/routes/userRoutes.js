import userControllers from '../controllers/userControllers.js';
import authControllers from '../controllers/authControllers.js';
import gameControllers from '../controllers/gameControllers.js';
import { websocketHandler } from '../websocket/websocket.js';
// import snake from '../plugins/websocketSnake.js';

export default async function userRoutes(fastify) {
  //user manipulation
  fastify.get('/api/users', userControllers.getAllUsersHandler);
  fastify.get('/api/game', gameControllers.getGameHandler);
  fastify.post('/api/winner', userControllers.saveWinnerHandler);

  //Avatar
  fastify.post(
    '/api/upload-avatar',
    { preHandler: authControllers.getUserFromRequest },
    userControllers.uploadAvatarHandler,
  );
  fastify.get(
    '/api/getAvatar',
    { preHandler: authControllers.getUserFromRequest },
    userControllers.getAvatarHandler,
  );

  // Websocket
  fastify.get('/ws/connect', { websocket: true }, websocketHandler);
  //Snake
  // fastify.get('/ws/snake', { websocket: true }, snake.snakeWebsocketHandler);

  //Auth:
  fastify.get('/api/auth/me', authControllers.verificationHandler);
  fastify.post('/api/auth/login', authControllers.loginHandler);
  fastify.post('/api/auth/register', authControllers.registerHandler);
  fastify.post('/api/auth/logout', authControllers.logoutHandler); // ??

  //DEBUGGING dont delete please
  // fastify.ready().then(() => {
  //     console.log(fastify.printRoutes());
  //   });
}
