import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../config/logger";
import { env } from "../config/env";

function formatZodError(err: ZodError) {
  return err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

/** Translates known Prisma error codes into user-friendly AppErrors. */
function fromPrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case "P2002": {
      const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return AppError.conflict(`A record with this ${target} already exists.`);
    }
    case "P2025":
      return AppError.notFound("The requested record could not be found.");
    case "P2003":
      return AppError.badRequest("This action violates a related record constraint.");
    default:
      return AppError.internal("A database error occurred.");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof ZodError) {
    appError = AppError.badRequest("Validation failed", formatZodError(err));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = fromPrismaError(err);
  } else if (err instanceof Error && err.name === "JsonWebTokenError") {
    appError = AppError.unauthorized("Invalid authentication token");
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    appError = AppError.unauthorized("Authentication token has expired");
  } else {
    appError = AppError.internal();
  }

  if (!appError.isOperational || appError.statusCode >= 500) {
    logger.error(err instanceof Error ? err.stack ?? err.message : String(err));
  }

  res.status(appError.statusCode).json({
    success: false,
    error: {
      message: appError.message,
      details: appError.details ?? undefined,
      stack: env.isProd ? undefined : (err instanceof Error ? err.stack : undefined),
    },
  });
}
