Prisma information

To initialize Prisma Client in your project, run:
    npx prisma generate

This command reads your schema.prisma and generates the Prisma Client in the specified output directory (usually node_modules/@prisma/client or your custom output).

If you haven’t set up Prisma yet, you can initialize it with:
    npx prisma init
Then edit your schema.prisma and run npx prisma generate again.


Run index.js file using Node.js in database directory. In your project, this file starts your Fastify backend server, sets up your API routes, and begins listening for HTTP requests (on port 3000). This allows your backend application to accept and respond to API calls:
    node index.js

To push schema changes to the database:
	npx prisma migrate dev --name fix-game-relations
	npx prisma generate
