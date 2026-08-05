import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

/** Verifies the bearer access token and attaches `req.user`. Throws 401 if missing/invalid. */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw AppError.unauthorized("Missing or malformed Authorization header");
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, isActive: true } });
  if (!user || !user.isActive) {
    throw AppError.unauthorized("Account is inactive or no longer exists");
  }

  req.user = { id: user.id, role: user.role };
  next();
});

/** Like `authenticate`, but proceeds without a user if no token is present (for optional-auth routes). */
export const authenticateOptional = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, isActive: true } });
    if (user?.isActive) req.user = { id: user.id, role: user.role };
  } catch {
    // Invalid token on an optional route — just proceed unauthenticated.
  }
  next();
});

/** Restricts a route to one or more roles. Must run after `authenticate`. */
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized("Authentication required");
    }
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden("You do not have permission to perform this action");
    }
    next();
  };
}
