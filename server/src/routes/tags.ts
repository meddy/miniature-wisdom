import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import yup, { BaseSchema } from "yup";

import { createTag, deleteTag, updateTag } from "../db/tags";

const router = express.Router();

const validate = (schema: BaseSchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.errors.join(", ") });
  }
};

const tagSchema = yup.object({
  name: yup.string().required(),
  parentId: yup.number(),
});

router.post(
  "/sessions",
  passport.authenticate("local", { failureRedirect: "login" })
);

router.post("/tags", validate(tagSchema), (req, res) => {
  try {
    const tag = createTag(req.body.name, req.body.parentId);
    res.status(201).json(tag);
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed: tags.name")) {
      res.send(422).json({ error: "Tag name taken" });
    } else if (err.message.includes("FOREIGN KEY constraint failed")) {
      res.send(422).json({ error: "Invalid parent ID" });
    }
    throw err;
  }
});

router.patch("/tags/:tagId", validate(tagSchema), (req, res) => {
  try {
    const tag = updateTag(
      Number(req.params.tagId),
      req.body.name,
      req.body.parentId
    );
    if (!tag) {
      res.status(404).json({ error: "Unknown tag" });
    } else {
      res.status(200).json(tag);
    }
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed: tags.name")) {
      res.send(422).json({ error: "Tag name taken" });
    } else if (err.message.includes("FOREIGN KEY constraint failed")) {
      res.send(422).json({ error: "Invalid parent ID" });
    }
  }
});

router.delete("/tags/:tagId", async (req, res, next) => {
  await deleteTag(Number(req.params.tagId));
  next();
});

router.get("/tags", (req, res) => {
  // load them all, but also include children recursively?
});

export default router;
