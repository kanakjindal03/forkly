import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: List all browse categories (e.g. Pizza, Healthy, Indian)
 *     tags: [Categories]
 */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { restaurants: true } } },
      orderBy: { name: "asc" },
    });
    sendSuccess(
      res,
      categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, restaurantCount: c._count.restaurants }))
    );
  })
);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (req, res) => {
    const category = await prisma.category.create({ data: { name: req.body.name, icon: req.body.icon } });
    sendCreated(res, category);
  })
);

export default router;
