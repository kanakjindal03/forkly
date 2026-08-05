import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated } from "../utils/apiResponse";

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, orderId, rating, comment } = req.body as {
    restaurantId: string;
    orderId?: string;
    rating: number;
    comment?: string;
  };

  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== req.user!.id || order.restaurantId !== restaurantId) {
      throw AppError.badRequest("This order does not belong to you for this restaurant");
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw AppError.badRequest("You can only review an order after it has been delivered");
    }
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: { userId: req.user!.id, restaurantId, orderId, rating, comment },
    });

    const agg = await tx.review.aggregate({ where: { restaurantId }, _avg: { rating: true }, _count: true });
    await tx.restaurant.update({
      where: { id: restaurantId },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
    });

    return created;
  });

  sendCreated(res, review);
});
