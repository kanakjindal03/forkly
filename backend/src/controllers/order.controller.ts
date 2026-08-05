import { Request, Response } from "express";
import { OrderStatus, PaymentStatus, RestaurantStatus, Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { generateOrderNumber } from "../utils/orderNumber";
import { CreateOrderInput } from "../validators/order.validators";
import { computeCouponDiscount } from "../services/coupon.service";

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

const ORDER_INCLUDE = {
  items: { include: { addOns: true, foodItem: true } },
  payment: true,
  review: true,
  address: true,
  user: {
  select: {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
  },
},

restaurant: {
  select: {
    id: true,
    name: true,
    logoUrl: true,
    ownerId: true,
    addressLine: true,
    city: true,
    phone: true,
  },
},
  deliveryPartner: { select: { id: true, userId: true, vehicleType: true, rating: true } },
} as const;

/** POST /orders — creates an order with server-computed pricing (never trusts client-sent totals). */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, addressId, paymentMethod, couponCode, items } = req.body as CreateOrderInput;

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant || restaurant.status !== RestaurantStatus.ACTIVE) {
    throw AppError.badRequest("This restaurant is not currently accepting orders");
  }

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== req.user!.id) throw AppError.badRequest("Invalid delivery address");

  const foodItemIds = items.map((i) => i.foodItemId);
  const foodItems = await prisma.foodItem.findMany({
    where: { id: { in: foodItemIds }, restaurantId },
    include: { addOns: true },
  });
  const foodItemMap = new Map(foodItems.map((f) => [f.id, f]));

  let subtotal = 0;
  const orderItemsData = items.map((line) => {
    const foodItem = foodItemMap.get(line.foodItemId);
    if (!foodItem) throw AppError.badRequest(`Food item ${line.foodItemId} does not belong to this restaurant`);
    if (!foodItem.isAvailable) throw AppError.badRequest(`"${foodItem.name}" is currently unavailable`);

    const selectedAddOns = foodItem.addOns.filter((a) => line.addOnIds.includes(a.id));
    const addOnsTotal = selectedAddOns.reduce((s, a) => s + Number(a.price), 0);
    const unitPrice = Number(foodItem.price) + addOnsTotal;
    subtotal += unitPrice * line.quantity;

    return {
      foodItemId: foodItem.id,
      nameSnapshot: foodItem.name,
      priceSnapshot: unitPrice,
      quantity: line.quantity,
      addOns: {
        create: selectedAddOns.map((a) => ({ addOnId: a.id, nameSnapshot: a.name, priceSnapshot: a.price })),
      },
    };
  });

  let discount = 0;
  let deliveryFee = DELIVERY_FEE;
  let coupon = null as Awaited<ReturnType<typeof prisma.coupon.findUnique>> | null;

  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    const result = computeCouponDiscount(coupon, { subtotal, restaurantId });
    discount = result.discount;
    if (result.freeDelivery) deliveryFee = 0;
  }

  const tax = Math.max(0, subtotal - discount) * TAX_RATE;
  const total = Math.max(0, subtotal - discount) + deliveryFee + tax;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user!.id,
        restaurantId,
        addressId,
        couponId: coupon?.id,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        items: { create: orderItemsData },
        payment: {
          create: {
            method: paymentMethod,
            amount: total,
            // Card/UPI/wallet are "charged" immediately by the mock gateway; cash is collected on delivery.
            status: paymentMethod === "CASH" ? PaymentStatus.PENDING : PaymentStatus.PAID,
            paidAt: paymentMethod === "CASH" ? null : new Date(),
          },
        },
      },
      include: ORDER_INCLUDE,
    });

    if (coupon) {
      await tx.coupon.update({ where: { id: coupon.id }, data: { usageCount: { increment: 1 } } });
    }

    await tx.notification.create({
      data: {
        userId: req.user!.id,
        title: "Order placed",
        body: `Your order from ${restaurant.name} has been placed.`,
        type: "order",
      },
    });
    await tx.notification.create({
      data: {
        userId: restaurant.ownerId,
        title: "New order received",
        body: `Order #${created.orderNumber} just came in.`,
        type: "order",
      },
    });

    return created;
  });

  sendCreated(res, order);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: ORDER_INCLUDE });
  if (!order) throw AppError.notFound("Order not found");

  const isOwnerOfOrder = order.userId === req.user!.id;
  const isRestaurantOwner = order.restaurant.ownerId === req.user!.id;
  const isAssignedPartner = order.deliveryPartner?.userId === req.user!.id;
  const isAdmin = req.user!.role === Role.ADMIN;

  if (!isOwnerOfOrder && !isRestaurantOwner && !isAssignedPartner && !isAdmin) {
    throw AppError.forbidden("You do not have access to this order");
  }

  sendSuccess(res, order);
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req);
  const where = { userId: req.user!.id };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);

  sendSuccess(res, orders, 200, buildPaginationMeta(page, limit, total));
});

/** GET /orders/restaurant — orders for the authenticated restaurant owner, optionally filtered by status. */
export const listRestaurantOrders = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: req.user!.id } });
  if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");

  const { page, limit, skip } = parsePagination(req);
  const status = req.query.status as OrderStatus | undefined;
  const where = { restaurantId: restaurant.id, ...(status && { status }) };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);

  sendSuccess(res, orders, 200, buildPaginationMeta(page, limit, total));
});

/** GET /orders/deliveries/available — orders ready for pickup, unassigned. For delivery partners. */
export const listAvailableDeliveries = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { status: OrderStatus.READY, deliveryPartnerId: null },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "asc" },
    take: 25,
  });
  sendSuccess(res, orders);
});

/** GET /orders/deliveries/mine — the authenticated delivery partner's active + past deliveries. */
export const listMyDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id } });
  if (!partner) throw AppError.notFound("You are not registered as a delivery partner");

  const { page, limit, skip } = parsePagination(req);
  const where = { deliveryPartnerId: partner.id };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);

  sendSuccess(res, orders, 200, buildPaginationMeta(page, limit, total));
});

/** POST /orders/:id/claim — a delivery partner accepts a READY, unassigned order. */
export const claimOrder = asyncHandler(async (req: Request, res: Response) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: req.user!.id } });
  if (!partner) throw AppError.notFound("You are not registered as a delivery partner");
  if (partner.status !== "ACTIVE" || !partner.isAvailable) {
    throw AppError.forbidden("You must be online and approved to accept deliveries");
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw AppError.notFound("Order not found");
  if (order.status !== OrderStatus.READY || order.deliveryPartnerId) {
    throw AppError.conflict("This order is no longer available for pickup");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { deliveryPartnerId: partner.id },
    include: ORDER_INCLUDE,
  });
  sendSuccess(res, updated);
});

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
  ACCEPTED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
  PICKED_UP: [OrderStatus.ON_THE_WAY],
  ON_THE_WAY: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

const RESTAURANT_STAGES: OrderStatus[] = [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.CANCELLED];
const PARTNER_STAGES: OrderStatus[] = [OrderStatus.PICKED_UP, OrderStatus.ON_THE_WAY, OrderStatus.DELIVERED];

/** PATCH /orders/:id/status — restaurant owners drive PENDING→READY, delivery partners drive PICKED_UP→DELIVERED. */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status: nextStatus } = req.body as { status: OrderStatus };
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { restaurant: true, deliveryPartner: true },
  });
  if (!order) throw AppError.notFound("Order not found");

  const isRestaurantOwner = order.restaurant.ownerId === req.user!.id;
  const isAssignedPartner = order.deliveryPartner?.userId === req.user!.id;
  const isAdmin = req.user!.role === Role.ADMIN;

  if (RESTAURANT_STAGES.includes(nextStatus) && !isRestaurantOwner && !isAdmin) {
    throw AppError.forbidden("Only the restaurant can update the order to this status");
  }
  if (PARTNER_STAGES.includes(nextStatus) && !isAssignedPartner && !isAdmin) {
    throw AppError.forbidden("Only the assigned delivery partner can update the order to this status");
  }

  if (!ALLOWED_TRANSITIONS[order.status].includes(nextStatus)) {
    throw AppError.conflict(`Cannot move an order from ${order.status} to ${nextStatus}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        deliveredAt: nextStatus === OrderStatus.DELIVERED ? new Date() : undefined,
      },
      include: ORDER_INCLUDE,
    });

    if (nextStatus === OrderStatus.DELIVERED && order.deliveryPartner) {
      await tx.deliveryPartner.update({
        where: { id: order.deliveryPartner.id },
        data: { totalDeliveries: { increment: 1 } },
      });
    }

    let notification = {
  title: "Order update",
  body: `Your order #${
    order.orderNumber
  } is now ${nextStatus
    .replace(/_/g, " ")
    .toLowerCase()}.`,
  type: "order",
};

if (
  nextStatus ===
  OrderStatus.PICKED_UP
) {
  notification = {
    title: "Order picked up",
    body: `Your order #${order.orderNumber} from ${order.restaurant.name} has been picked up by the delivery partner.`,
    type: "order_picked_up",
  };
}

if (
  nextStatus ===
  OrderStatus.DELIVERED
) {
  notification = {
    title: "Hurray! Order delivered 🎉",
    body: `Your order #${order.orderNumber} has been delivered. Enjoy your meal!`,
    type: "order_delivered",
  };
}

await tx.notification.create({
  data: {
    userId: order.userId,
    ...notification,
  },
});

    return result;
  });

  sendSuccess(res, updated);
});

/** POST /orders/:id/cancel — the customer may cancel while the order is still PENDING/ACCEPTED. */
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw AppError.notFound("Order not found");
  if (order.userId !== req.user!.id) throw AppError.forbidden("You can only cancel your own orders");
  const cancellableStatuses: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
];

if (!cancellableStatuses.includes(order.status)) {
  throw AppError.conflict("This order can no longer be cancelled");
}

  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELLED } });
  sendSuccess(res, updated);
});
