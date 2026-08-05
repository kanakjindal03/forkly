import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  addressId: z.string().uuid(),
  paymentMethod: z.enum(["CARD", "UPI", "WALLET", "CASH"]),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        foodItemId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
        addOnIds: z.array(z.string().uuid()).default([]),
      })
    )
    .min(1, "An order must contain at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "PREPARING", "READY", "PICKED_UP", "ON_THE_WAY", "DELIVERED", "CANCELLED"]),
});

export const listOrdersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
