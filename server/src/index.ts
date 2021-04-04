import cookieSession from "cookie-session";
import crypto from "crypto";
import express from "express";
import fs from "fs";
import https from "https";
import { User as LocalUser } from "minature-wisdom-lib/models";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import path from "path";

import { findAdmin, verifyPassword } from "./db/users";
import { tags, users } from "./routes";

declare module "passport" {
  namespace Express {
    interface User extends LocalUser {}
  }
}

passport.use(
  new LocalStrategy((username, password, verify) => {
    try {
      const admin = findAdmin();
      if (
        admin &&
        username === admin.username &&
        verifyPassword(password, admin.password)
      ) {
        return verify(null, admin);
      }
      return verify(null, false);
    } catch (err) {
      verify(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    return done(null, findAdmin());
  } catch (err) {
    done(err);
  }
});

const app = express();
app.use(express.static(path.resolve("../client/build")));
app.use(
  cookieSession({
    secret:
      process.env.NODE_ENV === "production"
        ? crypto.randomBytes(64).toString("hex")
        : "secret",
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/tags", tags);
app.use("/api/users", users);

const server = https.createServer(
  {
    key: fs.readFileSync(path.resolve("../certs/key.pem")),
    cert: fs.readFileSync(path.resolve("../certs/cert.pem")),
  },
  app
);

server.listen(3001, () => {
  console.log("server starting on 3001");
});
