import userControllers from '../controllers/userControllers.js';
import authControllers from '../controllers/authControllers.js';
import gameControllers from '../controllers/gameControllers.js';
import { websocketHandler } from '../websocket/websocket.js';
// import snake from '../plugins/websocketSnake.js';

export default async function userRoutes(fastify) {
  //user manipulation
  fastify.get(
    '/api/users',
    { preHandler: authControllers.authenticate },
    userControllers.getAllUsersHandler,
  );

  fastify.get(
    '/api/view_user_profile',
    { preHandler: authControllers.authenticate },
    userControllers.getUserProfileHandler,
  );

  fastify.patch(
    '/api/update_user_profile',
    { preHandler: authControllers.authenticate },
    userControllers.updateUserHandler,
  );

  fastify.post(
    '/api/add_friend',
    { preHandler: authControllers.authenticate },
    userControllers.addFriendHandler,
  ); //needs to be tested

  //   fastify.delete(
  //     '/api/delete_friend',
  //     { preHandler: authControllers.authenticate },
  //     userControllers.deteleFriendHandler,
  //   );

  // Websocket
  fastify.get('/ws/connect', { websocket: true }, websocketHandler);

  //Authorization:
  fastify.get('/api/auth/me', authControllers.verificationHandler);
  fastify.post('/api/auth/login', authControllers.loginHandler);
  fastify.post('/api/auth/register', authControllers.registerHandler);
  fastify.post('/api/auth/logout', authControllers.logoutHandler);
}
