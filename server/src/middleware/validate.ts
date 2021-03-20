import { BaseSchema } from "yup";
import { NextFunction, Request, Response } from "express";

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

export default validate;
