/**
 * Represents a known, "operational" error (bad request, not found, unauthorized, etc.)
 * as opposed to an unexpected programming error. The centralized error handler uses
 * `isOperational` to decide whether to expose the message to the client or mask it.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new AppError(message, 400, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }
  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }
  static conflict(message = "Conflict") {
    return new AppError(message, 409);
  }
  static tooMany(message = "Too many requests") {
    return new AppError(message, 429);
  }
  static internal(message = "Internal server error") {
    return new AppError(message, 500);
  }
}
