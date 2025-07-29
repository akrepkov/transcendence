import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import userRoutes from './routes/userRoutes.js';
import fastifyWebSocket from '@fastify/websocket';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fastifyMultipart from '@fastify/multipart';
import cookie from '@fastify/cookie';

//npm install @fastify/swagger @fastify/swagger-ui
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fs from 'fs';
//console.log('Environment Variables:', process.env); // Log all environment variables for debugging

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000; //TODO do we need to do something with port?
const PINGINTERVAL = 30000;

// console.log("File name in index.js:", __filename); // Debugging

// console.log("Dirname name in index.js:", __dirname); // Debugging

let isLoggerEnabled = true;

const getLoggerConfig = () =>
  isLoggerEnabled
    ? {
        level: 'info', // can change to info for more info
        transport: {
          target: 'pino-pretty',
          options: {
            ignore: 'pid,hostname,reqId,responseTime,worker',
            translateTime: 'HH:MM:ss',
          },
        },
        serializers: {
          req(request) {
            return `{ method: ${request.method}, url: ${request.url}}`;
          },
          res(response) {
            return `{ statusCode: ${response.statusCode} } for req { method: ${response.request.method}, url: '${response.request.url}' }`;
          },
        },
      }
    : false;

const fastify = Fastify({
  // logger: true,
  logger: getLoggerConfig(),
  https: {
    key: fs.readFileSync(path.join(__dirname, 'certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs/cert.pem')),
  },
});

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 1 * 1024 * 1024, // optional: max file size (10MB here)
  },
});

fastify.register(fastifyWebSocket);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend/public'),
  prefix: '/', // Serve static files from the root URL (e.g., /index.html, /style.css)
});

// Register the src directory to serve JS files (make sure you use a different prefix)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend/src'),
  prefix: '/src/', // Serve JS files under the /src/ path (e.g., /src/pong.js, /src/players.js)
  decorateReply: false,
});

// Register the dist directory to serve JS files (make sure you use a different prefix)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend/dist'),
  prefix: '/dist/', // Serve JS files under the /dist/ path (e.g., /dist/pong.js, /dist/players.js)
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // Serve JS files under the /uploads/ path (e.g., /uploads/pong.js, /uploads/players.js)
  decorateReply: false,
});

fastify.register(cookie, {});

// Register all routes
fastify.register(userRoutes);

//DEBUGGING!
// fastify.ready(() => {
//   console.log(fastify.printRoutes());
// });

// Swagger setup
await fastify.register(swagger, {
  mode: 'static',
  specification: {
    path: './docs/openapi.yaml',
    baseDir: './',
  },
});

await fastify.register(swaggerUi, {
  routePrefix: 'docs',
  uiConfig: {
    deepLinking: false,
    defaultModelsExpandDepth: -1,
  },
  staticCSP: true,
});

fastify.ready().then(() => {
  const interval = setInterval(() => {
    fastify.websocketServer.clients.forEach((socket) => {
      if (!socket.isAlive) {
        console.log('Terminating stale client');
        return socket.terminate();
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, PINGINTERVAL);
});

fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

fastify.setNotFoundHandler((request, reply) => {
  if (request.raw.method === 'GET' && !request.raw.url.startsWith('/api')) {
    return reply.sendFile('index.html');
  }
  reply.status(404).send({ error: 'Not found' });
});

// https://medium.com/@adarshahelvar/navigating-file-paths-in-node-js-with-filename-and-dirname-1dd2656f8d7e

//run: npx nodemon index.js
//rm -rf node_modules package-lock.json && npm init -y && npm install fastify fastify-static nodemon ws websocket better-sqlite3

//if native module version mismatch — your better-sqlite3 was compiled with a different Node.js version than the one you're currently using:
// npm rebuild better-sqlite3

//run npm start - it will run nodemon and python script for database at the same time
