import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  phone: z.string().min(7).max(20).optional(),
  role: z.literal("CUSTOMER").default("CUSTOMER"),
});

export const restaurantOwnerApplicationSchema =
  z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    phone: z.string().min(7).max(20),

    restaurantName: z.string().min(2).max(120),
    description: z.string().max(500).optional(),
    cuisine: z.string().min(2).max(80),
    addressLine: z.string().min(5).max(200),
    city: z.string().min(2).max(80),
    restaurantPhone: z
      .string()
      .min(7)
      .max(20)
      .optional(),
    restaurantEmail: z
      .string()
      .email()
      .optional(),
  });
export const deliveryPartnerApplicationSchema =
  z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    phone: z.string().min(7).max(20),
    vehicleType: z.string().min(2).max(40),
    vehicleNumber: z
      .string()
      .min(4)
      .max(30),
    licenseNumber: z
      .string()
      .min(4)
      .max(40),
  });
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const googleAuthSchema = z.object({
  credential: z.string().min(20),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput =
  z.infer<typeof googleAuthSchema>;
export type RestaurantOwnerApplicationInput =
  z.infer<
    typeof restaurantOwnerApplicationSchema
  >;
  export type DeliveryPartnerApplicationInput =
  z.infer<
    typeof deliveryPartnerApplicationSchema
  >;