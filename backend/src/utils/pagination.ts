import { Request } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
  const rawLimit = parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** Parses `sort=field:asc|desc` into a Prisma-compatible orderBy object. */
export function parseSort(req: Request, allowedFields: string[], fallback: string) {
  const raw = String(req.query.sort ?? fallback);
  const [field, direction] = raw.split(":");
  const safeField = allowedFields.includes(field) ? field : fallback.split(":")[0];
  const safeDirection = direction === "asc" ? "asc" : "desc";
  return { [safeField]: safeDirection } as Record<string, "asc" | "desc">;
}
