// Minimal stand-in for the generated @prisma/client package, used ONLY by Jest
// (see moduleNameMapper in jest.config.js) so tests can run without needing
// `prisma generate` + a live database. Mirrors the enums declared in
// prisma/schema.prisma plus the handful of runtime symbols our code touches.

export const Role = {
  CUSTOMER: "CUSTOMER",
  RESTAURANT_OWNER: "RESTAURANT_OWNER",
  DELIVERY_PARTNER: "DELIVERY_PARTNER",
  ADMIN: "ADMIN",
} as const;

export const RestaurantStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  REJECTED: "REJECTED",
} as const;

export const DeliveryPartnerStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const OrderStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  PICKED_UP: "PICKED_UP",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export const PaymentMethod = { CARD: "CARD", UPI: "UPI", WALLET: "WALLET", CASH: "CASH" } as const;
export const PaymentStatus = { PENDING: "PENDING", PAID: "PAID", FAILED: "FAILED", REFUNDED: "REFUNDED" } as const;
export const DiscountType = { PERCENTAGE: "PERCENTAGE", FLAT: "FLAT", FREE_DELIVERY: "FREE_DELIVERY" } as const;

export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  constructor(message: string, opts: { code: string; meta?: Record<string, unknown> }) {
    super(message);
    this.code = opts.code;
    this.meta = opts.meta;
    Object.setPrototypeOf(this, PrismaClientKnownRequestError.prototype);
  }
}

export const Prisma = { PrismaClientKnownRequestError };

/** Stub constructor — real query methods are mocked per-test via jest.mock("../config/prisma"). */
export class PrismaClient {
  $connect() {
    return Promise.resolve();
  }
  $disconnect() {
    return Promise.resolve();
  }
  $transaction(fn: any) {
    return typeof fn === "function" ? fn(this) : Promise.all(fn);
  }
}
