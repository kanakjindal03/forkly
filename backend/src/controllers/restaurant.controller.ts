import { Request, Response } from "express";
import {
  Prisma,
  RestaurantStatus,
  OrderStatus,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { parsePagination, buildPaginationMeta, parseSort } from "../utils/pagination";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6)
  );
}

/** GET /restaurants — public browse with search, filters, sort, and pagination. */
export const listRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const orderBy = parseSort(req, ["avgRating", "createdAt", "name"], "avgRating:desc");
  const { search, category, cuisine, minRating, priceLevel, city } = req.query as Record<string, string>;

  const where: Prisma.RestaurantWhereInput = {
    status: RestaurantStatus.ACTIVE,
    ...(search && {
  OR: [
    {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      cuisine: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      city: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      addressLine: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      menuCategories: {
        some: {
          foodItems: {
            some: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      },
    },
  ],
}),
    ...(cuisine && { cuisine: { equals: cuisine, mode: "insensitive" } }),
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(minRating && { avgRating: { gte: Number(minRating) } }),
    ...(priceLevel && { priceLevel: Number(priceLevel) }),
    ...(category && { restaurantCategories: { some: { category: { name: { equals: category, mode: "insensitive" } } } } }),
  };

  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      orderBy,
      skip,
      take: limit,
     include: {
  restaurantCategories: {
    include: {
      category: true,
    },
  },
  menuCategories: {
    orderBy: {
      position: "asc",
    },
    include: {
      foodItems: {
        where: {
          isAvailable: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  },
},
    }),
    prisma.restaurant.count({ where }),
  ]);

  sendSuccess(res, restaurants, 200, buildPaginationMeta(page, limit, total));
});

/** GET /restaurants/:idOrSlug — public restaurant detail (by id or slug). */
export const getRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const restaurant = await prisma.restaurant.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], status: RestaurantStatus.ACTIVE },
    include: {
      restaurantCategories: { include: { category: true } },
      menuCategories: {
        orderBy: { position: "asc" },
        include: { foodItems: { include: { images: true, addOns: true }, orderBy: { name: "asc" } } },
      },
    },
  });
  if (!restaurant) throw AppError.notFound("Restaurant not found");
  sendSuccess(res, restaurant);
});

/** GET /restaurants/:id/reviews — public paginated reviews for a restaurant. */
export const listRestaurantReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const where = { restaurantId: req.params.id };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    }),
    prisma.review.count({ where }),
  ]);

  sendSuccess(res, reviews, 200, buildPaginationMeta(page, limit, total));
});

/** POST /restaurants — a RESTAURANT_OWNER submits a new restaurant application (starts PENDING). */
export const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
  if (existing) throw AppError.conflict("You already have a restaurant registered on Forkly");

  const { name, description, cuisine, addressLine, city, latitude, longitude, phone, email, categoryIds } = req.body;

  const restaurant = await prisma.restaurant.create({
    data: {
      ownerId: req.user!.id,
      name,
      slug: slugify(name),
      description,
      cuisine,
      addressLine,
      city,
      latitude,
      longitude,
      phone,
      email,
      status: RestaurantStatus.PENDING,
      restaurantCategories: {
        create: (categoryIds as string[] | undefined)?.map((categoryId) => ({ categoryId })) ?? [],
      },
    },
  });

  sendCreated(res, restaurant);
});

/** GET /restaurants/me — the authenticated owner's own restaurant (any status). */
export const getMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: req.user!.id },
    include: { menuCategories: { include: { foodItems: true } } },
  });
  if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");
  sendSuccess(res, restaurant);
});

/** PATCH /restaurants/me — the authenticated owner updates their own restaurant. */
export const updateMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
  if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");

  const { categoryIds, ...rest } = req.body;
  const updated = await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      ...rest,
      ...(categoryIds && {
        restaurantCategories: {
          deleteMany: {},
          create: (categoryIds as string[]).map((categoryId) => ({ categoryId })),
        },
      }),
    },
  });
  sendSuccess(res, updated);
});
/** GET /restaurants/me/analytics — real analytics for the authenticated owner. */
export const getMyRestaurantAnalytics =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const restaurant =
        await prisma.restaurant.findUnique({
          where: {
            ownerId: req.user!.id,
          },
          select: {
            id: true,
          },
        });

      if (!restaurant) {
        throw AppError.notFound(
          "You do not have a restaurant registered yet"
        );
      }

      const today = new Date();

      const startDate = new Date(
        today.getFullYear(),
        today.getMonth() - 11,
        1
      );

      const orders =
        await prisma.order.findMany({
          where: {
            restaurantId: restaurant.id,
            status: OrderStatus.DELIVERED,
            placedAt: {
              gte: startDate,
            },
          },
          select: {
            subtotal: true,
            discount: true,
            placedAt: true,
            items: {
              select: {
                nameSnapshot: true,
                priceSnapshot: true,
                quantity: true,
                foodItem: {
                  select: {
                    menuCategory: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const monthlyRevenue =
        Array.from(
          { length: 12 },
          (_, index) => {
            const date = new Date(
              today.getFullYear(),
              today.getMonth() - 11 + index,
              1
            );

            return {
              key: `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`,
              month: date.toLocaleString(
                "en-US",
                {
                  month: "short",
                }
              ),
              revenue: 0,
            };
          }
        );

      const monthMap = new Map(
        monthlyRevenue.map((month) => [
          month.key,
          month,
        ])
      );

      const itemMap = new Map<
        string,
        {
          name: string;
          sold: number;
          revenue: number;
        }
      >();

      const categoryMap =
        new Map<string, number>();

      let totalRevenue = 0;

      for (const order of orders) {
        const orderRevenue = Math.max(
          0,
          Number(order.subtotal) -
            Number(order.discount)
        );

        totalRevenue += orderRevenue;

        const monthKey =
          `${order.placedAt.getFullYear()}-` +
          `${String(
            order.placedAt.getMonth() + 1
          ).padStart(2, "0")}`;

        const monthEntry =
          monthMap.get(monthKey);

        if (monthEntry) {
          monthEntry.revenue +=
            orderRevenue;
        }

        for (const item of order.items) {
          const existingItem =
            itemMap.get(
              item.nameSnapshot
            ) || {
              name: item.nameSnapshot,
              sold: 0,
              revenue: 0,
            };

          existingItem.sold +=
            item.quantity;

          existingItem.revenue +=
            Number(item.priceSnapshot) *
            item.quantity;

          itemMap.set(
            item.nameSnapshot,
            existingItem
          );

          const categoryName =
            item.foodItem
              ?.menuCategory?.name ||
            "Other";

          categoryMap.set(
            categoryName,
            (categoryMap.get(
              categoryName
            ) || 0) + item.quantity
          );
        }
      }

      const topItems = Array.from(
        itemMap.values()
      )
        .sort(
          (first, second) =>
            second.sold - first.sold
        )
        .slice(0, 5)
        .map((item) => ({
          ...item,
          revenue: Number(
            item.revenue.toFixed(2)
          ),
        }));

      const categoryMix = Array.from(
        categoryMap.entries()
      )
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort(
          (first, second) =>
            second.value - first.value
        );

      sendSuccess(res, {
        totalRevenue: Number(
          totalRevenue.toFixed(2)
        ),
        deliveredOrders: orders.length,
        averageOrderValue:
          orders.length > 0
            ? Number(
                (
                  totalRevenue /
                  orders.length
                ).toFixed(2)
              )
            : 0,
        monthlyRevenue:
          monthlyRevenue.map(
            ({ month, revenue }) => ({
              month,
              revenue: Number(
                revenue.toFixed(2)
              ),
            })
          ),
        topItems,
        categoryMix,
      });
    }
  );
