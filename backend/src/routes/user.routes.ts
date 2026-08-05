import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createAddressSchema, updateAddressSchema } from "../validators/misc.validators";

const router = Router();

router.use(authenticate);

router.patch("/me", userController.updateProfile);

router.get("/me/addresses", userController.listAddresses);
router.post("/me/addresses", validate({ body: createAddressSchema }), userController.createAddress);
router.patch("/me/addresses/:id", validate({ body: updateAddressSchema }), userController.updateAddress);
router.delete("/me/addresses/:id", userController.deleteAddress);

router.get("/me/favorites", userController.listFavorites);
router.post("/me/favorites", userController.addFavorite);
router.delete("/me/favorites/:id", userController.removeFavorite);

router.get("/me/notifications", userController.listNotifications);
router.patch("/me/notifications/:id/read", userController.markNotificationRead);
router.patch("/me/notifications/read-all", userController.markAllNotificationsRead);

export default router;
