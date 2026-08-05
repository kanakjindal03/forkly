import { Response } from "express";

/**
 * Every endpoint in the API responds with this consistent envelope shape,
 * whether it succeeds or fails, so clients can rely on a single parsing path.
 */
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export function sendSuccess<T>(res: Response, data: T, status = 200, meta?: ApiMeta): Response {
  return res.status(status).json({
    success: true,
    data,
    meta: meta ?? null,
  });
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
