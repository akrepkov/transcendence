import Fastify from 'fastify';
import authRoutes from '../routes/authRoute.js';
import userRoutes from '../../backend/routes/userRoutes.js';
// import gameRoutes from '../../backend/routes/gameRoutes.js';

const fastify = Fastify();

fastify.register(authRoutes);
// fastify.register(userRoutes);
// fastify.register(gameRoutes));
