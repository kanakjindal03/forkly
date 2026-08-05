import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "4000", 10),
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  databaseUrl: required("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/forkly"),

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", "dev_access_secret_change_me"),
    refreshSecret: required("JWT_REFRESH_SECRET", "dev_refresh_secret_change_me"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },

  corsOrigin:
  process.env.CORS_ORIGIN ??
  "http://localhost:5174",

googleClientId:
  process.env.GOOGLE_CLIENT_ID ?? "",
  demoAutoOrderFlow:
  process.env.DEMO_AUTO_ORDER_FLOW === "true",

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? "300", 10),
  },
};
