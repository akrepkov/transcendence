
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import * as authServices from '../services/authServices.js';
const clients = new Map();



const generalWebsocket = async (ws, req) => {
    const id = clients.size + 1;
    clients.set(id);
    console.log("Clients ", clients);
    console.log("CONNECTED")
    ws.on('message', message => {
      console.log('Received:', message.toString());
      ws.send(
        JSON.stringify({
            type: 'id',
            id,
            clients
        })
      )
    });
  
    ws.on('close', () => {
      console.log('WebSocket closed');
      clients.delete(id);
    });
    // const cookies = cookie.parse(req.headers.cookie || '');
    // const token = cookies.token;
    // console.log("TOKEEEEEEEEEEEEEEEEEEEEEEEEEN " , token)
    // if (!token) {
    //     console.log("No token")
    //     ws.close(401, 'Unauthorized: No token');
    //     return;
    // }
    // try {
    //     const payload = jwt.verify(token, JWT_SECRET);

    //     // Optionally check credentials in DB, same as your verificationHandler
    //     const user = await authServices.checkCredentials(payload.email);
    //     console.log("CONNECTED user ", user);
    //     if (!user) {
    //         connection.socket.close(402, 'Unauthorized: Invalid credentials');
    //         return;
    //     }

    //     // Attach user info to connection
    //     connection.user = user;

    //     // Now handle messages from authenticated user
    //     connection.socket.on('message', (message) => {
    //         console.log(`User ${user.username} says:`, message);
    //         // handle game logic or chat here
    //     });

    //     connection.socket.on('close', () => {
    //         console.log(`User ${user.username} disconnected`);
    //     });

    // } catch (err) {
    //     console.error('WebSocket error:', err);
    //     connection.socket.close(403, 'Unauthorized: Token verification failed');
    // }
}

export default {
    generalWebsocket,
};
