import { z } from "zod";

export const createMenuCategorySchema = z.object({
  name: z.string().min(1).max(60),
  position: z.number().int().min(0).optional(),
});

export const createFoodItemSchema = z.object({
  menuCategoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive().max(10000),
  isVeg: z.boolean().default(true),
  calories: z.number().int().positive().optional(),
  images: z.array(z.string().url()).max(5).optional(),
  addOns: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        price: z.number().nonnegative(),
      })
    )
    .max(10)
    .optional(),
});

export const updateFoodItemSchema = createFoodItemSchema.partial().extend({
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
});

export const listFoodItemsQuerySchema = z.object({
  category: z.string().uuid().optional(),
  veg: z.enum(["true", "false"]).optional(),
  available: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
});
