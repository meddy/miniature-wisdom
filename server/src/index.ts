import path from "path";
import fastify from "fastify";

const server = fastify();

server.register(require("fastify-static"), {
  root: path.resolve("../client/build"),
});

server.listen(3001, (err, address) => {
  if (err) {
    throw err;
  }

  server.log.info(`server listening on ${address}`);
});
