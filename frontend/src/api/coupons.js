import { apiRequest } from "./client.js";

function mapCoupon(coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    description:
      coupon.description || "",
    discountType:
      coupon.discountType,
    value: Number(coupon.value || 0),

    maxDiscount:
      coupon.maxDiscount == null
        ? null
        : Number(coupon.maxDiscount),

    minOrderValue:
      coupon.minOrderValue == null
        ? null
        : Number(
            coupon.minOrderValue
          ),

    restaurantId:
      coupon.restaurantId || null,

    isActive: Boolean(
      coupon.isActive
    ),

    usageCount:
      coupon.usageCount || 0,

    expiresAt:
      coupon.expiresAt || null,

    restaurant:
      coupon.restaurant
        ? {
            id:
              coupon.restaurant.id,
            name:
              coupon.restaurant.name,
            slug:
              coupon.restaurant.slug,
            logoUrl:
              coupon.restaurant
                .logoUrl || null,
          }
        : null,
  };
}

export async function getActiveCoupons() {
  const coupons = await apiRequest(
    "/coupons/active"
  );

  return (
    Array.isArray(coupons)
      ? coupons
      : []
  ).map(mapCoupon);
}