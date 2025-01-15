import { ErrorRequestHandler } from "express-serve-static-core";
import { MulterError } from "multer";
import { ValidationError } from "yup";
import AuthorizationException from "@exception/AuthorizationException";
import UnprocessableException from "@exception/UnprocessableException";
import NotFoundException from "@exception/NotFoundException";

const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AuthorizationException) {
    return res.status(401).json({ error: err?.message });
  }

  if (err instanceof UnprocessableException) {
    return res.status(422).json({ error: JSON.parse(err?.message) });
  }

  if (err instanceof NotFoundException) {
    return res.status(404).json({ error: err?.message });
  }

  if (err instanceof ValidationError) {
    return res.status(422).json({
      error: err.inner.map((v) => ({
        label: v.params?.label,
        path: v.path,
        type: v.type,
      })),
    });
  }

  if (err instanceof MulterError) {
    return res.status(422).json({ error: err.message });
  }

  return res.status(500).json({
    error: err?.message,
  });
};

export default ErrorMiddleware;
