import path from "path";
import fastify from "fastify";
import db from "./db";

const server = fastify();

server.register(require("fastify-static"), {
  root: path.resolve("../client/build"),
});

server.get("/users/admin", (request, reply) => {
  const selectAdmin = db.prepare(
    "SELECT * FROM users WHERE is_admin = 1 LIMIT 1"
  );
  reply.send(selectAdmin.get());
});
// apps loads
// load user from api
// if null then create user
// if 403 then login

// create user on startup
// or create user through cli

server.listen(3001, (err, address) => {
  if (err) {
    throw err;
  }

  server.log.info(`server listening on ${address}`);
});
