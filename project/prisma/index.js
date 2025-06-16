
const Fastify = require('fastify');
const fastify = Fastify({ logger: true });

fastify.register(require('./routes/auth'));
fastify.register(require('./routes/users'));
fastify.register(require('./routes/games'));

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server is running on http://localhost:3000');
});
