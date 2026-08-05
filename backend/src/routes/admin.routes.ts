import { Router } from "express";
import { z } from "zod";
import * as adminController from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOfferSchema } from "../validators/misc.validators";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/stats", adminController.getDashboardStats);

router.get("/users", adminController.listUsers);
router.patch("/users/:id/active", validate({ body: z.object({ isActive: z.boolean() }) }), adminController.setUserActive);

router.get("/restaurants", adminController.listAllRestaurants);
router.get("/restaurants/applications", adminController.listRestaurantApplications);
router.patch(
  "/restaurants/:id/review",
  validate({ body: z.object({ approve: z.boolean() }) }),
  adminController.reviewRestaurantApplication
);
router.patch(
  "/restaurants/:id/status",
  validate({ body: z.object({ status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"]) }) }),
  adminController.setRestaurantStatus
);
router.get(
  "/delivery-partners",
  adminController.listAllPartners
);
router.get("/delivery-partners/applications", adminController.listPartnerApplications);
router.patch(
  "/delivery-partners/:id/review",
  validate({ body: z.object({ approve: z.boolean() }) }),
  adminController.reviewPartnerApplication
);
router.patch(
  "/delivery-partners/:id/status",
  validate({ body: z.object({ status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]) }) }),
  adminController.setPartnerStatus
);

router.get("/orders", adminController.listAllOrders);

router.post("/offers", validate({ body: createOfferSchema }), adminController.createOffer);
router.get("/offers", adminController.listOffers);
router.patch("/offers/:id/toggle", adminController.toggleOffer);

export default router;
