import express from "express";
import passport from "passport";
import * as yup from "yup";

import { findAdmin, upsertAdmin } from "../db/user";
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
    res.status(200).json({});
  } else if (!req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    res.status(200).json(admin);
  }
});

router.post("/admin", validate(userCredsSchema), (req, res, next) => {
  const admin = findAdmin();
  if (typeof admin === "undefined") {
    res.status(400).json({ error: "Admin already defined" });
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
