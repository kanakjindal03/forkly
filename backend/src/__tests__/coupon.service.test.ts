import { computeCouponDiscount } from "../services/coupon.service";

const baseCoupon = {
  id: "c1",
  code: "FORK20",
  description: null,
  discountType: "PERCENTAGE",
  value: 20 as any,
  maxDiscount: 6 as any,
  minOrderValue: null,
  restaurantId: null,
  isActive: true,
  usageCount: 0,
  expiresAt: null,
  createdAt: new Date(),
} as any;

describe("computeCouponDiscount", () => {
  it("applies a percentage discount capped at maxDiscount", () => {
    const result = computeCouponDiscount(baseCoupon, { subtotal: 100, restaurantId: "r1" });
    expect(result.discount).toBe(6); // 20% of 100 = 20, capped at 6
    expect(result.freeDelivery).toBe(false);
  });

  it("applies a flat discount", () => {
    const flatCoupon = { ...baseCoupon, discountType: "FLAT", value: 5 };
    const result = computeCouponDiscount(flatCoupon, { subtotal: 40, restaurantId: "r1" });
    expect(result.discount).toBe(5);
  });

  it("marks free delivery coupons with zero monetary discount", () => {
    const shippingCoupon = { ...baseCoupon, discountType: "FREE_DELIVERY", value: 0 };
    const result = computeCouponDiscount(shippingCoupon, { subtotal: 40, restaurantId: "r1" });
    expect(result.discount).toBe(0);
    expect(result.freeDelivery).toBe(true);
  });

  it("throws for a missing coupon", () => {
    expect(() => computeCouponDiscount(null, { subtotal: 10, restaurantId: "r1" })).toThrow(/Invalid coupon/i);
  });

  it("throws for an inactive coupon", () => {
    const inactive = { ...baseCoupon, isActive: false };
    expect(() => computeCouponDiscount(inactive, { subtotal: 10, restaurantId: "r1" })).toThrow(/no longer active/i);
  });

  it("throws for an expired coupon", () => {
    const expired = { ...baseCoupon, expiresAt: new Date(Date.now() - 1000) };
    expect(() => computeCouponDiscount(expired, { subtotal: 10, restaurantId: "r1" })).toThrow(/expired/i);
  });

  it("throws when the coupon is scoped to a different restaurant", () => {
    const scoped = { ...baseCoupon, restaurantId: "r-other" };
    expect(() => computeCouponDiscount(scoped, { subtotal: 10, restaurantId: "r1" })).toThrow(/not valid for this restaurant/i);
  });

  it("throws when subtotal is below the coupon's minimum order value", () => {
    const withMin = { ...baseCoupon, minOrderValue: 50 };
    expect(() => computeCouponDiscount(withMin, { subtotal: 10, restaurantId: "r1" })).toThrow(/minimum order/i);
  });

  it("never discounts more than the subtotal itself", () => {
    const bigFlat = { ...baseCoupon, discountType: "FLAT", value: 999 };
    const result = computeCouponDiscount(bigFlat, { subtotal: 15, restaurantId: "r1" });
    expect(result.discount).toBe(15);
  });
});
