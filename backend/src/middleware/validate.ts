import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

/**
 * Validates and coerces `req.body` / `req.query` / `req.params` against zod schemas,
 * replacing them with the parsed (and type-coerced) values on success.
 * Validation errors are forwarded to the centralized error handler as ZodErrors.
 */
export function validate(schemas: { body?: Schema; query?: Schema; params?: Schema }) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as any;
      if (schemas.params) req.params = schemas.params.parse(req.params) as any;
      next();
    } catch (err) {
      next(err);
    }
  };
}
