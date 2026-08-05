import { Router } from "express";
import { z } from "zod";
import * as partnerController from "../controllers/deliveryPartner.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

router.use(authenticate, authorize("DELIVERY_PARTNER"));

router.post(
  "/apply",
  validate({ body: z.object({ vehicleType: z.string().min(2).max(40) }) }),
  partnerController.applyAsPartner
);
router.get("/me", partnerController.getMyPartnerProfile);
router.patch(
  "/me/availability",
  validate({ body: z.object({ isAvailable: z.boolean() }) }),
  partnerController.updateAvailability
);
router.patch(
  "/me/location",
  validate({ body: z.object({ latitude: z.number(), longitude: z.number() }) }),
  partnerController.updateLocation
);
router.get("/me/earnings", partnerController.getEarningsSummary);

export default router;
