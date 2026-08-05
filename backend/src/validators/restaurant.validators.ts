import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  cuisine: z.string().min(2).max(60),
  addressLine: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email().optional(),
  categoryIds: z.array(z.string().uuid()).default([]),
});

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  openingHours: z
    .array(
      z.object({
        day: z.string(),
        open: z.string(),
        close: z.string(),
      })
    )
    .optional(),
});

export const listRestaurantsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  priceLevel: z.coerce.number().min(1).max(4).optional(),
  city: z.string().optional(),
});

export const restaurantStatusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"]),
});
