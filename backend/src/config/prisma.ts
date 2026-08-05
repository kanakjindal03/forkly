import { PrismaClient } from "@prisma/client";
import { env } from "./env";

// Reuse a single PrismaClient instance across hot-reloads in dev to avoid
// exhausting the Postgres connection pool.
declare global {
  // eslint-disable-next-line no-var
  var __forklyPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__forklyPrisma ??
  new PrismaClient({
    log: env.isProd ? ["error", "warn"] : ["error", "warn"],
  });

if (!env.isProd) {
  global.__forklyPrisma = prisma;
}
