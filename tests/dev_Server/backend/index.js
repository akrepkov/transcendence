import Fastify from 'fastify';
import path from 'path';
import { dirname } from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';


const fastify = Fastify({ logger: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
console.log(__filename);
console.log(__dirname);
// Serve static files from the frontend build
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../frontend/',  'public'),
    prefix: '/', // URL prefix (can be changed if needed)
});

// Default route
fastify.get('/', async (_, reply) => {
    return reply.sendFile('index.html'); // Ensure index.html exists
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
});
