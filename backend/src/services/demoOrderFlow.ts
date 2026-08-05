import {
  DeliveryPartnerStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";
import { logger } from "../config/logger";
import { prisma } from "../config/prisma";

const STEP_DELAY_MS: Record<
  Exclude<OrderStatus, "DELIVERED" | "CANCELLED">,
  number
> = {
  PENDING: 6_000,
  ACCEPTED: 7_000,
  PREPARING: 10_000,
  READY: 5_000,
  PICKED_UP: 7_000,
  ON_THE_WAY: 10_000,
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: OrderStatus.ACCEPTED,
  ACCEPTED: OrderStatus.PREPARING,
  PREPARING: OrderStatus.READY,
  READY: OrderStatus.PICKED_UP,
  PICKED_UP: OrderStatus.ON_THE_WAY,
  ON_THE_WAY: OrderStatus.DELIVERED,
};

let isAdvancing = false;

async function advanceDemoOrders() {
  if (isAdvancing) return;
  isAdvancing = true;

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: [
            OrderStatus.PENDING,
            OrderStatus.ACCEPTED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.PICKED_UP,
            OrderStatus.ON_THE_WAY,
          ],
        },
      },
      orderBy: { updatedAt: "asc" },
    });

    const now = Date.now();

    for (const order of orders) {
      const delay = STEP_DELAY_MS[order.status as keyof typeof STEP_DELAY_MS];
      if (now - order.updatedAt.getTime() < delay) continue;

      const nextStatus = NEXT_STATUS[order.status];
      if (!nextStatus) continue;

      await prisma.$transaction(async (tx) => {
        const current = await tx.order.findUnique({
          where: { id: order.id },
        });

        if (!current || current.status !== order.status) return;

        let deliveryPartnerId = current.deliveryPartnerId;
        let assignedPartnerUserId: string | null = null;

        if (
          (nextStatus === OrderStatus.READY ||
            nextStatus === OrderStatus.PICKED_UP) &&
          !deliveryPartnerId
        ) {
          const partner = await tx.deliveryPartner.findFirst({
            where: {
              status: DeliveryPartnerStatus.ACTIVE,
              isAvailable: true,
            },
            orderBy: { totalDeliveries: "asc" },
          });

          if (!partner) {
            logger.warn(
              `Demo flow paused for order ${current.orderNumber}: no active delivery partner`
            );
            return;
          }

          deliveryPartnerId = partner.id;
          assignedPartnerUserId = partner.userId;
        }

        await tx.order.update({
          where: { id: current.id },
          data: {
            status: nextStatus,
            deliveryPartnerId,
            deliveredAt:
              nextStatus === OrderStatus.DELIVERED
                ? new Date()
                : undefined,
          },
        });

        if (
          nextStatus === OrderStatus.DELIVERED &&
          deliveryPartnerId
        ) {
          await tx.deliveryPartner.update({
            where: { id: deliveryPartnerId },
            data: { totalDeliveries: { increment: 1 } },
          });

          await tx.payment.updateMany({
            where: {
              orderId: current.id,
              status: PaymentStatus.PENDING,
            },
            data: {
              status: PaymentStatus.PAID,
              paidAt: new Date(),
            },
          });
        }

        let notification = {
  title: "Order update",
  body: `Your order #${
    current.orderNumber
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
    body: `Your order #${current.orderNumber} has been picked up by the delivery partner.`,
    type: "order_picked_up",
  };
}

if (
  nextStatus ===
  OrderStatus.DELIVERED
) {
  notification = {
    title:
      "Hurray! Order delivered 🎉",
    body: `Your order #${current.orderNumber} has been delivered. Enjoy your meal!`,
    type: "order_delivered",
  };
}

await tx.notification.create({
  data: {
    userId: current.userId,
    ...notification,
  },
});

        if (assignedPartnerUserId) {
          await tx.notification.create({
            data: {
              userId: assignedPartnerUserId,
              title: "Delivery assigned",
              body: `Order #${current.orderNumber} has been assigned to you.`,
              type: "delivery",
            },
          });
        }

        logger.info(
          `Demo order ${current.orderNumber}: ${current.status} -> ${nextStatus}`
        );
      });
    }
  } catch (error) {
    logger.error("Demo order flow failed", error);
  } finally {
    isAdvancing = false;
  }
}

export function startDemoOrderFlow() {
  logger.warn("Demo automatic order flow is enabled");
  void advanceDemoOrders();

  const interval = setInterval(() => {
    void advanceDemoOrders();
  }, 1_000);

  return () => clearInterval(interval);
}