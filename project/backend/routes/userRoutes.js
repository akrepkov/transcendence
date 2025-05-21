import userControllers from '../controllers/userControllers.js';
import authControllers from '../controllers/authControllers.js';
import websocket from '../websocket/websocketChat.js';
import pong from '../websocket/remotePong/websocketRemote.js';
// import snake from '../plugins/websocketSnake.js';


export default async function userRoutes(fastify) {
    //user manipulation
    fastify.post('/api/users', userControllers.addUserHandler);
    fastify.get('/api/users', userControllers.getAllUsersHandler);
    fastify.delete('/api/users', userControllers.deleteUserHandler);
    fastify.post('/api/winner', userControllers.saveWinnerHandler);
    //Avatar
    fastify.post('/api/upload-avatar', { preHandler: authControllers.getUserFromRequest },  userControllers.uploadAvatarHandler);
    fastify.get('/api/getAvatar', { preHandler: authControllers.getUserFromRequest },  userControllers.getAvatarHandler);
    //Chat:
    fastify.get('/ws/chat', { websocket: true }, websocket.chatWebsocketHandler);
    //Remote
    fastify.get('/ws/game', { websocket: true }, pong.gameWebsocketHandler);
    //Snake
    // fastify.get('/ws/snake', { websocket: true }, snake.snakeWebsocketHandler);


	//Auth:
    fastify.get('/api/auth/me', authControllers.verificationHandler);
	fastify.post('/api/auth/login', authControllers.loginHandler);
	fastify.post('/api/auth/register', authControllers.registerHandler);
	fastify.post('/api/auth/logout', authControllers.logoutHandler);// ??

    // fastify.get('/api/remote', userControllers.remoteHandler);
    // fastify.post('/api/remote', userControllers.remoteHandler);
    // fastify.post('/api/remote/players', userControllers.remotePlayersHandler);
    // fastify.post('/api/remote/winner', userControllers.remoteWinnerHandler); 
    
    //Profile only for logged in
    // fastify.get('/api/profile', { preHandler: authControllers.authenticate }, userControllers.profileHandler);

    //DEBUGGING
    fastify.ready().then(() => {
        console.log(fastify.printRoutes());
      });
}



//Create a middleware hook to check for authenticated users (via session or token) and protect routes like /game, /profile, etc. - What is it????