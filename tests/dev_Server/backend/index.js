const Fastify = require("fastify");

const fastify = Fastify();

fastify.get("/api/greet", async () => {
    return { message: "Hello from Fastify!" };
});

fastify.listen({ port: 3000 }, (err) => {
    if (err) throw err;
    console.log("✅ Backend running on http://localhost:3000");
});
