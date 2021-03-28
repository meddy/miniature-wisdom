import express from "express";
import * as messages from "minature-wisdom-lib/messages";
import passport from "passport";
import * as yup from "yup";

import { findAdmin, upsertAdmin } from "../db/users";
import validate from "../middleware/validate";

const router = express.Router();

const userCredsSchema = yup.object({
  username: yup
    .string()
    .matches(/[a-z_][a-z0-9_]{0,30}/)
    .required(),
  password: yup.string().required(),
});

router.get("/admin", (req, res) => {
  const admin = findAdmin();
  if (!admin) {
    res.status(404).json({ error: messages.ADMIN_UNDEFINED });
  } else if (!req.isAuthenticated()) {
    res.status(401).json({ error: messages.UNAUTHENTICATED });
  } else {
    res.status(200).json(admin);
  }
});

router.post("/admin", validate(userCredsSchema), (req, res, next) => {
  const admin = findAdmin();
  if (typeof admin === "undefined") {
    res.status(400).json({ error: messages.ADMIN_ALREADY_DEFINED });
  } else {
    upsertAdmin(req.body.username, req.body.password);

    req.login(admin, (err) => {
      if (err) {
        next(err);
      }

      res.status(200).json(admin);
    });
  }
});

router.post("/session", passport.authenticate("local"), (req, res) => {
  res.status(201).json(findAdmin());
});

router.delete("/session", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

export default router;
