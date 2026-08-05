import { Router } from "express";
import * as restaurantController from "../controllers/restaurant.controller";
import * as menuController from "../controllers/menu.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRestaurantSchema, updateRestaurantSchema, listRestaurantsQuerySchema } from "../validators/restaurant.validators";
import { createMenuCategorySchema, createFoodItemSchema, updateFoodItemSchema } from "../validators/foodItem.validators";

const router = Router();

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: Browse active restaurants (search, filter, sort, paginate)
 *     tags: [Restaurants]
 */
router.get("/", validate({ query: listRestaurantsQuerySchema }), restaurantController.listRestaurants);

router.get(
  "/me",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  restaurantController.getMyRestaurant
);
router.get(
  "/me/analytics",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  restaurantController.getMyRestaurantAnalytics
);
router.patch(
  "/me",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate({ body: updateRestaurantSchema }),
  restaurantController.updateMyRestaurant
);

router.post(
  "/me/menu-categories",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate({ body: createMenuCategorySchema }),
  menuController.createMenuCategory
);
router.delete("/me/menu-categories/:id", authenticate, authorize("RESTAURANT_OWNER"), menuController.deleteMenuCategory);

router.post(
  "/me/food-items",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate({ body: createFoodItemSchema }),
  menuController.createFoodItem
);
router.patch(
  "/me/food-items/:id",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate({ body: updateFoodItemSchema }),
  menuController.updateFoodItem
);
router.delete("/me/food-items/:id", authenticate, authorize("RESTAURANT_OWNER"), menuController.deleteFoodItem);
router.patch(
  "/me/food-items/:id/availability",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  menuController.toggleAvailability
);

router.post(
  "/",
  authenticate,
  authorize("RESTAURANT_OWNER"),
  validate({ body: createRestaurantSchema }),
  restaurantController.createRestaurant
);

router.get("/:id/reviews", restaurantController.listRestaurantReviews);

/**
 * @openapi
 * /restaurants/{idOrSlug}:
 *   get:
 *     summary: Get a restaurant's full detail including its menu
 *     tags: [Restaurants]
 */
router.get("/:idOrSlug", restaurantController.getRestaurant);

export default router;
