import Fastify from 'fastify';
import authRoutes from '../routes/authRoute.js';
import userRoutes from '../../backend/routes/userRoutes.js';
// import gameRoutes from '../../backend/routes/gameRoutes.js';

const fastify = Fastify();

fastify.register(authRoutes);
// fastify.register(userRoutes);
// fastify.register(gameRoutes));

// Test route for DB connection

fastify.get('/db-test', async (request, reply) => {
  try {
    // Example: Replace with your actual DB query
    // const result = await db.query('SELECT 1');
    const result = { success: true }; // Mock result
    return { status: 'ok', result };
  } catch (error) {
    return reply.status(500).send({ status: 'error', error: error.message });
  }
});

// Uncomment below to test other routes as needed
// fastify.register(authRoutes);
// fastify.register(userRoutes);
// fastify.register(gameRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
