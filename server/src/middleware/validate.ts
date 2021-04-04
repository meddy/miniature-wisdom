import { NextFunction, Request, Response } from "express";
import { BaseSchema, ValidationError } from "yup";

const validate = (schema: BaseSchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (!ValidationError.isError(err)) {
      return next(err);
    }

    let messageMap = {};
    if (err.inner.length > 0) {
      messageMap = err.inner.reduce((acc, err) => {
        if (!err.path) {
          return acc;
        }

        return { ...acc, [err.path]: err.errors };
      }, {});
    } else if (err.path) {
      messageMap = { [err.path]: err.errors };
    }

    if (Object.keys(messageMap).length < 1) {
      res.status(400).json({ error: "failed to validate request" });
    } else {
      res.status(400).json({ errors: messageMap });
    }
  }
};

export default validate;
