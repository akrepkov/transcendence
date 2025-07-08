import {
  addUser,
  getUsers,
  getUserByEmail,
  deleteUser,
  saveGameResults,
  uploadAvatarInDatabase,
  getAvatarFromDatabase,
} from '../services/userServices.js';

export default async function (fastify, opts) {
  // Get all users
  fastify.get('/users', async (request, reply) => {
    const users = await getUsers();
    reply.send(users);
  });

  // Add a new user
  fastify.post('/users', async (request, reply) => {
    const { username, email, password } = request.body;
    const user = await addUser({ username, email, password });
    reply.send(user);
  });

  // Get user by email
  fastify.get('/users/:email', async (request, reply) => {
    const { email } = request.params;
    const user = await getUserByEmail(email);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    reply.send(user);
  });

  // Delete user by username
  fastify.delete('/users/:username', async (request, reply) => {
    const { username } = request.params;
    const deleted = await deleteUser(username);
    if (!deleted) {
      return reply.status(404).send({ error: 'User not found' });
    }
    reply.send({ success: true });
  });

  // Save game results
  fastify.post('/users/game-results', async (request, reply) => {
    const { winnerName, loserName } = request.body;
    const result = await saveGameResults(winnerName, loserName);
    reply.send({ success: !!result });
  });

  // Upload avatar
  fastify.post('/users/:username/avatar', async (request, reply) => {
    const { username } = request.params;
    const { filepath } = request.body;
    const user = await uploadAvatarInDatabase(filepath, username);
    reply.send(user);
  });

  // Get avatar
  fastify.get('/users/:username/avatar', async (request, reply) => {
    const { username } = request.params;
    const avatar = await getAvatarFromDatabase(username);
    if (!avatar) {
      return reply.status(404).send({ error: 'Avatar not found' });
    }
    reply.send({ avatar });
  });
}
