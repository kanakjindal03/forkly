import { Router } from "express";
import * as couponController from "../controllers/coupon.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCouponSchema, applyCouponSchema } from "../validators/misc.validators";

const router = Router();

router.post("/apply", authenticate, validate({ body: applyCouponSchema }), couponController.applyCouponPreview);

router.get(
  "/active",
  authenticate,
  couponController.listActiveCoupons
);

router.use(authenticate, authorize("RESTAURANT_OWNER", "ADMIN"));
router.post("/", validate({ body: createCouponSchema }), couponController.createCoupon);
router.get("/", couponController.listCoupons);
router.patch("/:id/toggle", couponController.toggleCoupon);

export default router;
