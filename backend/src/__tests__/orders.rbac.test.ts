import request from "supertest";
import { signAccessToken } from "../utils/jwt";

jest.mock("../config/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    order: { findMany: jest.fn(), count: jest.fn() },
  },
}));

import { createApp } from "../app";
import { prisma } from "../config/prisma";

const app = createApp();
const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock };
  order: { findMany: jest.Mock; count: jest.Mock };
};

function tokenFor(id: string, role: string) {
  return signAccessToken({ sub: id, role });
}

describe("RBAC on /api/v1/orders", () => {
  it("rejects an unauthenticated request with 401", async () => {
    const res = await request(app).get("/api/v1/orders");
    expect(res.status).toBe(401);
  });

  it("rejects a valid token for a role that isn't CUSTOMER with 403", async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({ id: "partner-1", role: "DELIVERY_PARTNER", isActive: true });

    const res = await request(app).get("/api/v1/orders").set("Authorization", `Bearer ${tokenFor("partner-1", "DELIVERY_PARTNER")}`);

    expect(res.status).toBe(403);
  });

  it("allows a CUSTOMER to list their own orders", async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({ id: "cust-1", role: "CUSTOMER", isActive: true });
    mockedPrisma.order.findMany.mockResolvedValueOnce([]);
    mockedPrisma.order.count.mockResolvedValueOnce(0);

    const res = await request(app).get("/api/v1/orders").set("Authorization", `Bearer ${tokenFor("cust-1", "CUSTOMER")}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toMatchObject({ total: 0 });
  });

  it("rejects an inactive/suspended account even with a valid token", async () => {
    mockedPrisma.user.findUnique.mockResolvedValueOnce({ id: "cust-2", role: "CUSTOMER", isActive: false });

    const res = await request(app).get("/api/v1/orders").set("Authorization", `Bearer ${tokenFor("cust-2", "CUSTOMER")}`);

    expect(res.status).toBe(401);
  });
});
