import request from "supertest";
import { createApp } from "../app";

const app = createApp();

describe("app-level behavior", () => {
  it("GET /api/v1/health returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
  });

  it("returns a consistent 404 envelope for unknown routes", async () => {
    const res = await request(app).get("/api/v1/this-route-does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toMatch(/route not found/i);
  });

  it("GET / returns a friendly landing payload", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe("Forkly API");
  });
});
