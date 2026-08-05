import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  restaurantOwnerApplicationSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
  deliveryPartnerApplicationSchema,
} from "../validators/auth.validators";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 */
router.post(
  "/register/restaurant-owner",
  authLimiter,
  validate({
    body: restaurantOwnerApplicationSchema,
  }),
  authController.registerRestaurantOwner
);
router.post(
  "/register/delivery-partner",
  authLimiter,
  validate({
    body: deliveryPartnerApplicationSchema,
  }),
  authController.registerDeliveryPartner
);
router.post("/register", authLimiter, validate({ body: registerSchema }), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 */
router.post("/login", authLimiter, validate({ body: loginSchema }), authController.login);
router.post(
  "/google",
  authLimiter,
  validate({
    body: googleAuthSchema,
  }),
  authController.googleAuth
);

router.post("/refresh", authLimiter, validate({ body: refreshSchema }), authController.refresh);
router.post("/forgot-password", authLimiter, validate({ body: forgotPasswordSchema }), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate({ body: resetPasswordSchema }), authController.resetPassword);
router.get("/me", authenticate, authController.me);

export default router;
