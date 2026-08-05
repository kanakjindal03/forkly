import { z } from "zod";

export const createReviewSchema = z.object({
  restaurantId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(24)
    .transform((v) => v.toUpperCase()),
  description: z.string().max(200).optional(),
  discountType: z.enum(["PERCENTAGE", "FLAT", "FREE_DELIVERY"]),
  value: z.number().nonnegative().default(0),
  maxDiscount: z.number().positive().optional(),
  minOrderValue: z.number().nonnegative().optional(),
  restaurantId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1),
  restaurantId: z.string().uuid(),
  subtotal: z.number().nonnegative(),
});

export const createAddressSchema = z.object({
  label: z.string().min(1).max(40),
  line1: z.string().min(3).max(200),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const createOfferSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(300).optional(),
  scope: z.enum(["platform", "restaurant", "category"]).default("platform"),
  restaurantId: z.string().uuid().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});
