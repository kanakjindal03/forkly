import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { loadOpenApiDocument } from "./config/swagger";
import { apiLimiter } from "./middleware/rateLimiter";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (!env.isTest) {
    app.use(morgan(env.isProd ? "combined" : "dev", { stream: { write: (msg) => logger.info(msg.trim()) } }));
  }

  app.use("/api/v1", apiLimiter, routes);

  if (!env.isTest) {
    try {
      const openApiDocument = loadOpenApiDocument();
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
    } catch (err) {
      logger.warn("Could not load OpenAPI document for /api-docs — is docs/openapi.yaml present?");
    }
  }

  app.get("/", (_req, res) => {
    res.json({ success: true, data: { message: "Forkly API", docs: "/api-docs", health: "/api/v1/health" } });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
