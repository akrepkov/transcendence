const prisma = require('../../prisma/prismaClient');

module.exports = async function (fastify, opts) {
  // Register
  fastify.post('/register', async (request, reply) => {
    const { username, email, password } = request.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return reply.status(400).send({ error: 'Username or email already exists' });
    }

    const user = await prisma.user.create({
      data: { username, email, password },
    });

    reply.send({ user });
  });

  // Login (very basic, no hashing or JWT yet)
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    reply.send({ user });
  });
};
