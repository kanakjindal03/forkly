import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import restaurantRoutes from "./restaurant.routes";
import categoryRoutes from "./category.routes";
import orderRoutes from "./order.routes";
import reviewRoutes from "./review.routes";
import couponRoutes from "./coupon.routes";
import deliveryPartnerRoutes from "./deliveryPartner.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/delivery-partners", deliveryPartnerRoutes);
router.use("/admin", adminRoutes);

export default router;
