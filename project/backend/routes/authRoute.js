import prisma from '../../prisma/prismaClient.js';
import * as authServices from '../services/authServices.js';

export default async function (fastify, opts) {
  // Register
  fastify.post('/register', async (request, reply) => {
    const { username, email, password } = request.body;

    try {
      const user = await authServices.registerUser({ username, email, password });
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = user;

      reply.send({ user: userWithoutPassword });
    } catch (err) {
      reply.status(418).send({ error: 'Registration failed', details: 'existing user' });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = authServices.authenticateUser({ email, password });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    const { password: _, ...userWithoutPassword } = user;
    reply.send({ user: userWithoutPassword });
  });
}
