import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import { startDemoOrderFlow } from "./services/demoOrderFlow";

const app = createApp();

const stopDemoOrderFlow =
  env.demoAutoOrderFlow
    ? startDemoOrderFlow()
    : () => {};

const server = app.listen(env.port, () => {
  logger.info(`Forkly API listening on port ${env.port} [${env.nodeEnv}]`);
  logger.info(`API docs available at http://localhost:${env.port}/api-docs`);
});

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down gracefully`);
  stopDemoOrderFlow();
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
