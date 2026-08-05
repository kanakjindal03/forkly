import { Request, Response } from "express";
import {
  RestaurantStatus,
  Role,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { computeCouponDiscount } from "../services/coupon.service";

/** GET /coupons/active — active coupons visible to customers. */
export const listActiveCoupons =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {
      const now = new Date();

      const coupons =
        await prisma.coupon.findMany({
          where: {
            isActive: true,
            AND: [
              {
                OR: [
                  {
                    expiresAt: null,
                  },
                  {
                    expiresAt: {
                      gte: now,
                    },
                  },
                ],
              },
              {
                OR: [
                  {
                    restaurantId: null,
                  },
                  {
                    restaurant: {
                      is: {
                        status:
                          RestaurantStatus.ACTIVE,
                      },
                    },
                  },
                ],
              },
            ],
          },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      sendSuccess(res, coupons);
    }
  );

/** POST /coupons — a restaurant owner creates a coupon scoped to their own restaurant, or an admin creates a platform-wide one. */
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  let restaurantId: string | undefined = req.body.restaurantId;

  if (req.user!.role === Role.RESTAURANT_OWNER) {
    const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
    if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");
    restaurantId = restaurant.id;
  }

  const coupon = await prisma.coupon.create({ data: { ...req.body, restaurantId } });
  sendCreated(res, coupon);
});

/** GET /coupons — owners see their own restaurant's coupons; admins see all. */
export const listCoupons = asyncHandler(async (req: Request, res: Response) => {
  let where = {};
  if (req.user!.role === Role.RESTAURANT_OWNER) {
    const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
    if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");
    where = { restaurantId: restaurant.id };
  }
  const coupons = await prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" } });
  sendSuccess(res, coupons);
});

export const toggleCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) throw AppError.notFound("Coupon not found");

  if (req.user!.role === Role.RESTAURANT_OWNER) {
    const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
    if (!restaurant || coupon.restaurantId !== restaurant.id) throw AppError.forbidden("This is not your coupon");
  }

  const updated = await prisma.coupon.update({ where: { id: coupon.id }, data: { isActive: !coupon.isActive } });
  sendSuccess(res, updated);
});

/** POST /coupons/apply — lets the cart preview a discount before checkout, without redeeming it yet. */
export const applyCouponPreview = asyncHandler(async (req: Request, res: Response) => {
  const { code, restaurantId, subtotal } = req.body as { code: string; restaurantId: string; subtotal: number };
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  const result = computeCouponDiscount(coupon, { subtotal, restaurantId });
  sendSuccess(res, { code: coupon!.code, ...result });
});
