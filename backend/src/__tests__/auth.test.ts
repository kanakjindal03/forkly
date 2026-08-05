import request from "supertest";

jest.mock("../config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Imported after the mock so the controller picks up the mocked module.
import { createApp } from "../app";
import { prisma } from "../config/prisma";

const app = createApp();
const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; findUniqueOrThrow: jest.Mock; create: jest.Mock };
};

describe("POST /api/v1/auth/register", () => {
  it("creates a new account and returns tokens", async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockedPrisma.user.create.mockResolvedValueOnce({
      id: "user-1",
      name: "Priya Nair",
      email: "priya@example.com",
      role: "CUSTOMER",
      avatarUrl: null,
    });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Priya Nair", email: "priya@example.com", password: "Sup3rSecret!" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("priya@example.com");
    expect(typeof res.body.data.accessToken).toBe("string");
    expect(typeof res.body.data.refreshToken).toBe("string");
  });

  it("rejects a duplicate email with 409", async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({ id: "existing-user" });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Priya Nair", email: "priya@example.com", password: "Sup3rSecret!" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("returns a 400 validation error for a malformed email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Priya Nair", email: "not-an-email", password: "Sup3rSecret!" });

    expect(res.status).toBe(400);
    expect(res.body.error.details).toEqual(expect.arrayContaining([expect.objectContaining({ path: "email" })]));
  });

  it("returns a 400 validation error for a short password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Priya Nair", email: "priya@example.com", password: "short" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/auth/me", () => {
  it("rejects requests with no Authorization header", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects a malformed Authorization header", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", "not-a-bearer-token");
    expect(res.status).toBe(401);
  });
});
