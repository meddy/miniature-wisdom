import express from "express";
import passport from "passport";

const router = express.Router();

router.post(
  "/sessions",
  passport.authenticate("local", { failureRedirect: "login" })
);

export default router;
