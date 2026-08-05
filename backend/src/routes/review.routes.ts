import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createReviewSchema } from "../validators/misc.validators";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  validate({ body: createReviewSchema }),
  reviewController.createReview
);

export default router;
