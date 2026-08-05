import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validators";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Place a new order (server computes all pricing)
 *     tags: [Orders]
 */
router.post("/", authorize("CUSTOMER"), validate({ body: createOrderSchema }), orderController.createOrder);
router.get("/", authorize("CUSTOMER"), orderController.listMyOrders);

router.get("/restaurant", authorize("RESTAURANT_OWNER"), orderController.listRestaurantOrders);

router.get("/deliveries/available", authorize("DELIVERY_PARTNER"), orderController.listAvailableDeliveries);
router.get("/deliveries/mine", authorize("DELIVERY_PARTNER"), orderController.listMyDeliveries);
router.post("/:id/claim", authorize("DELIVERY_PARTNER"), orderController.claimOrder);

router.get("/:id", orderController.getOrder);
router.patch("/:id/status", validate({ body: updateOrderStatusSchema }), orderController.updateOrderStatus);
router.post("/:id/cancel", authorize("CUSTOMER"), orderController.cancelOrder);

export default router;
