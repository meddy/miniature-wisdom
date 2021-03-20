import express from "express";
import yup from "yup";

import { createTag, deleteTag, fetchAll, updateTag } from "../db/tags";
import validate from "../middleware/validate";
import { checkAuthenticated } from "../middleware/auth";

const tagSchema = yup.object({
  name: yup.string().required(),
  parentId: yup.number(),
});

const router = express.Router();

router.use(checkAuthenticated);

router.post("/", validate(tagSchema), (req, res) => {
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

router.patch("/:tagId", validate(tagSchema), (req, res) => {
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

router.delete("/:tagId", async (req, res, next) => {
  try {
    await deleteTag(Number(req.params.tagId));
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get("/", (req, res) => {
  res.status(200).json(fetchAll());
});

export default router;
