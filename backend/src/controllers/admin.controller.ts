import { Request, Response } from "express";
import { RestaurantStatus, DeliveryPartnerStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [userCount, restaurantCount, partnerCount, orderCount, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.restaurant.count({ where: { status: RestaurantStatus.ACTIVE } }),
    prisma.deliveryPartner.count({ where: { status: DeliveryPartnerStatus.ACTIVE } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
  ]);

  sendSuccess(res, {
    totalUsers: userCount,
    totalRestaurants: restaurantCount,
    totalDeliveryPartners: partnerCount,
    totalOrders: orderCount,
    totalRevenue: revenue._sum.total ?? 0,
  });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const { search, role, status } = req.query as Record<string, string>;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(role && { role: role as any }),
    ...(status && { isActive: status === "active" }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  avatarUrl: true,
  _count: {
    select: {
      orders: true,
    },
  },
},
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  sendSuccess(res, users, 200, buildPaginationMeta(page, limit, total));
});

export const setUserActive = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body as { isActive: boolean };
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isActive } });
  sendSuccess(res, user);
});

export const listRestaurantApplications = asyncHandler(async (_req: Request, res: Response) => {
  const applications = await prisma.restaurant.findMany({
    where: { status: RestaurantStatus.PENDING },
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  sendSuccess(res, applications);
});

export const reviewRestaurantApplication = asyncHandler(async (req: Request, res: Response) => {
  const { approve } = req.body as { approve: boolean };
  const restaurant = await prisma.restaurant.findUnique({ where: { id: req.params.id } });
  if (!restaurant) throw AppError.notFound("Restaurant application not found");

  const updated = await prisma.$transaction(
  async (transaction) => {
    const updatedRestaurant =
      await transaction.restaurant.update({
        where: {
          id: restaurant.id,
        },
        data: {
          status: approve
            ? RestaurantStatus.ACTIVE
            : RestaurantStatus.REJECTED,
        },
      });

    await transaction.user.update({
      where: {
        id: restaurant.ownerId,
      },
      data: {
        isActive: approve,
      },
    });

    return updatedRestaurant;
  }
);

  await prisma.notification.create({
    data: {
      userId: restaurant.ownerId,
      title: approve ? "Restaurant approved" : "Restaurant application rejected",
      body: approve
        ? `${restaurant.name} is now live on Forkly.`
        : `${restaurant.name}'s application was not approved. Contact support for details.`,
      type: "restaurant",
    },
  });

  sendSuccess(res, updated);
});

export const setRestaurantStatus =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { status } = req.body as {
        status: RestaurantStatus;
      };

      const restaurant =
        await prisma.restaurant.findUnique({
          where: {
            id: req.params.id,
          },
          select: {
            id: true,
            ownerId: true,
          },
        });

      if (!restaurant) {
        throw AppError.notFound(
          "Restaurant not found"
        );
      }

      const updated = await prisma.$transaction(
        async (transaction) => {
          const updatedRestaurant =
            await transaction.restaurant.update({
              where: {
                id: restaurant.id,
              },
              data: {
                status,
              },
            });

          await transaction.user.update({
            where: {
              id: restaurant.ownerId,
            },
            data: {
              isActive:
                status === RestaurantStatus.ACTIVE,
            },
          });

          return updatedRestaurant;
        }
      );

      sendSuccess(res, updated);
    }
  );
export const listAllPartners = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req);

    const [partners, total] = await Promise.all([
      prisma.deliveryPartner.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.deliveryPartner.count(),
    ]);

    sendSuccess(
      res,
      partners,
      200,
      buildPaginationMeta(page, limit, total)
    );
  }
);

export const listPartnerApplications = asyncHandler(async (_req: Request, res: Response) => {
  const applications = await prisma.deliveryPartner.findMany({
    where: { status: DeliveryPartnerStatus.PENDING },
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: "asc" },
  });
  sendSuccess(res, applications);
});

export const reviewPartnerApplication = asyncHandler(async (req: Request, res: Response) => {
  const { approve } = req.body as { approve: boolean };
  const partner = await prisma.deliveryPartner.findUnique({ where: { id: req.params.id } });
  if (!partner) throw AppError.notFound("Delivery partner application not found");

  const updated = await prisma.$transaction(
  async (transaction) => {
    const updatedPartner =
      await transaction.deliveryPartner.update({
        where: {
          id: partner.id,
        },
        data: {
          status: approve
            ? DeliveryPartnerStatus.ACTIVE
            : DeliveryPartnerStatus.SUSPENDED,
        },
      });

    await transaction.user.update({
      where: {
        id: partner.userId,
      },
      data: {
        isActive: approve,
      },
    });

    return updatedPartner;
  }
);

  await prisma.notification.create({
    data: {
      userId: partner.userId,
      title: approve ? "You're approved!" : "Application not approved",
      body: approve
        ? "You can now go online and start accepting deliveries."
        : "Your delivery partner application was not approved.",
      type: "delivery",
    },
  });

  sendSuccess(res, updated);
});

export const setPartnerStatus =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { status } = req.body as {
        status: DeliveryPartnerStatus;
      };

      const partner =
        await prisma.deliveryPartner.findUnique({
          where: {
            id: req.params.id,
          },
          select: {
            id: true,
            userId: true,
          },
        });

      if (!partner) {
        throw AppError.notFound(
          "Delivery partner not found"
        );
      }

      const updated = await prisma.$transaction(
        async (transaction) => {
          const updatedPartner =
            await transaction.deliveryPartner.update({
              where: {
                id: partner.id,
              },
              data: {
                status,
                isAvailable:
                  status ===
                  DeliveryPartnerStatus.ACTIVE
                    ? undefined
                    : false,
              },
            });

          await transaction.user.update({
            where: {
              id: partner.userId,
            },
            data: {
              isActive:
                status ===
                DeliveryPartnerStatus.ACTIVE,
            },
          });

          return updatedPartner;
        }
      );

      sendSuccess(res, updated);
    }
  );

export const listAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const status = req.query.status as string | undefined;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status: status as any } : {},
      include: {
        user: { select: { name: true } },
        restaurant: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: status ? { status: status as any } : {} }),
  ]);

  sendSuccess(res, orders, 200, buildPaginationMeta(page, limit, total));
});

export const listAllRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
  include: {
    orders: {
      where: {
        status: "DELIVERED",
      },
      select: {
        total: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  skip,
  take: limit,
}),
    prisma.restaurant.count(),
  ]);
  sendSuccess(res, restaurants, 200, buildPaginationMeta(page, limit, total));
});

export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const offer = await prisma.offer.create({ data: req.body });
  sendCreated(res, offer);
});

export const listOffers = asyncHandler(async (_req: Request, res: Response) => {
  const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, offers);
});

export const toggleOffer = asyncHandler(async (req: Request, res: Response) => {
  const offer = await prisma.offer.findUnique({ where: { id: req.params.id } });
  if (!offer) throw AppError.notFound("Offer not found");
  const updated = await prisma.offer.update({ where: { id: offer.id }, data: { isActive: !offer.isActive } });
  sendSuccess(res, updated);
});
