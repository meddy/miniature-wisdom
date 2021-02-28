import path from "path";
import fastify from "fastify";

const server = fastify();

server.register(require("fastify-static"), {
  root: path.resolve("../client/build"),
});

// apps loads
// check if authenticated
// if not authenticated
// if result not user, go to create user
// if user go to login
// if authenticated, show main page

server.listen(3001, (err, address) => {
  if (err) {
    throw err;
  }

  server.log.info(`server listening on ${address}`);
});
