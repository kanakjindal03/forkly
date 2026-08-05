import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** General API rate limit — generous, protects against accidental hammering. */
export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many requests, please try again later." } },
});

/** Stricter limit for auth endpoints to slow down credential-stuffing / brute force. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many authentication attempts, please try again later." } },
});
