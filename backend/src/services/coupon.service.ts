import { Coupon } from "@prisma/client";
import { AppError } from "../utils/AppError";

export interface CouponContext {
  subtotal: number;
  restaurantId: string;
}

export interface CouponResult {
  discount: number;
  freeDelivery: boolean;
}

/**
 * Validates a coupon against an order context and computes the discount.
 * Throws an AppError if the coupon is missing, inactive, expired, scoped to a
 * different restaurant, or the order doesn't meet its minimum order value.
 */
export function computeCouponDiscount(coupon: Coupon | null, ctx: CouponContext): CouponResult {
  if (!coupon) throw AppError.badRequest("Invalid coupon code");
  if (!coupon.isActive) throw AppError.badRequest("This coupon is no longer active");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw AppError.badRequest("This coupon has expired");
  if (coupon.restaurantId && coupon.restaurantId !== ctx.restaurantId) {
    throw AppError.badRequest("This coupon is not valid for this restaurant");
  }
  if (coupon.minOrderValue && ctx.subtotal < Number(coupon.minOrderValue)) {
    throw AppError.badRequest(`This coupon requires a minimum order of $${Number(coupon.minOrderValue).toFixed(2)}`);
  }

  if (coupon.discountType === "FREE_DELIVERY") {
    return { discount: 0, freeDelivery: true };
  }

  let discount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discount = (ctx.subtotal * Number(coupon.value)) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
  } else if (coupon.discountType === "FLAT") {
    discount = Number(coupon.value);
  }

  return { discount: Math.min(discount, ctx.subtotal), freeDelivery: false };
}
