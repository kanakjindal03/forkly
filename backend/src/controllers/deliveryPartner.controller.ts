import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";

/** POST /delivery-partners/apply — a DELIVERY_PARTNER-role user submits their vehicle details for approval. */
export const applyAsPartner = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id } });
  if (existing) throw AppError.conflict("You have already submitted a delivery partner application");

  const partner = await prisma.deliveryPartner.create({
    data: { userId: req.user!.id, vehicleType: req.body.vehicleType, status: "PENDING" },
  });
  sendCreated(res, partner);
});

export const getMyPartnerProfile = asyncHandler(async (req: Request, res: Response) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id }, include: { user: true } });
  if (!partner) throw AppError.notFound("You have not applied as a delivery partner yet");
  sendSuccess(res, partner);
});

export const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id } });
  if (!partner) throw AppError.notFound("You have not applied as a delivery partner yet");
  if (partner.status !== "ACTIVE") throw AppError.forbidden("Your application is not yet approved");

  const updated = await prisma.deliveryPartner.update({
    where: { id: partner.id },
    data: { isAvailable: req.body.isAvailable },
  });
  sendSuccess(res, updated);
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id } });
  if (!partner) throw AppError.notFound("You have not applied as a delivery partner yet");

  const updated = await prisma.deliveryPartner.update({
    where: { id: partner.id },
    data: { currentLatitude: req.body.latitude, currentLongitude: req.body.longitude },
  });
  sendSuccess(res, updated);
});

/**
 * GET /delivery-partners/me/earnings — a simple earnings summary derived from delivered orders.
 * NOTE: this approximates payout as the order's delivery fee; a production system would
 * track payouts in a dedicated ledger table (base pay + tips + bonuses) instead.
 */
export const getEarningsSummary =
  asyncHandler(
    async (req: Request, res: Response) => {
      const partner =
        await prisma.deliveryPartner.findUnique({
          where: {
            userId: req.user!.id,
          },
        });

      if (!partner) {
        throw AppError.notFound(
          "You have not applied as a delivery partner yet"
        );
      }

      const now = new Date();

      const since = new Date(now);
      since.setHours(0, 0, 0, 0);
      since.setDate(since.getDate() - 6);

      const delivered =
        await prisma.order.findMany({
          where: {
            deliveryPartnerId: partner.id,
            status: OrderStatus.DELIVERED,
            deliveredAt: {
              gte: since,
            },
          },
          select: {
            deliveryFee: true,
            deliveredAt: true,
          },
          orderBy: {
            deliveredAt: "asc",
          },
        });

      const dateKey = (date: Date) =>
        [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(
            2,
            "0"
          ),
          String(date.getDate()).padStart(
            2,
            "0"
          ),
        ].join("-");

      const dailyBreakdown = Array.from(
        { length: 7 },
        (_, index) => {
          const date = new Date(since);
          date.setDate(
            since.getDate() + index
          );

          return {
            date: dateKey(date),
            day: date.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),
            amount: 0,
            deliveries: 0,
          };
        }
      );

      for (const order of delivered) {
        if (!order.deliveredAt) continue;

        const orderDate = dateKey(
          order.deliveredAt
        );

        const entry = dailyBreakdown.find(
          (day) => day.date === orderDate
        );

        if (entry) {
          entry.amount += Number(
            order.deliveryFee
          );
          entry.deliveries += 1;
        }
      }

      const last7Days =
        dailyBreakdown.reduce(
          (total, day) =>
            total + day.amount,
          0
        );

      const today =
        dailyBreakdown[
          dailyBreakdown.length - 1
        ];

      sendSuccess(res, {
        todayEarnings: today?.amount || 0,
        last7Days,
        deliveryCount: delivered.length,
        lifetimeDeliveries:
          partner.totalDeliveries,
        rating: partner.rating,
        dailyBreakdown,
      });
    }
  );