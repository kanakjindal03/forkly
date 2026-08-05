import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess, sendNoContent } from "../utils/apiResponse";

/** Ensures the authenticated user owns the restaurant they're trying to modify. */
async function requireOwnedRestaurant(userId: string) {
  const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: userId } });
  if (!restaurant) throw AppError.notFound("You do not have a restaurant registered yet");
  return restaurant;
}

export const createMenuCategory = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const category = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: req.body.name, position: req.body.position ?? 0 },
  });
  sendCreated(res, category);
});

export const deleteMenuCategory = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const category = await prisma.menuCategory.findUnique({ where: { id: req.params.id } });
  if (!category || category.restaurantId !== restaurant.id) throw AppError.notFound("Menu category not found");

  await prisma.menuCategory.delete({ where: { id: req.params.id } });
  sendNoContent(res);
});

export const createFoodItem = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const { menuCategoryId, images, addOns, ...rest } = req.body;

  const menuCategory = await prisma.menuCategory.findUnique({ where: { id: menuCategoryId } });
  if (!menuCategory || menuCategory.restaurantId !== restaurant.id) {
    throw AppError.badRequest("Invalid menu category for this restaurant");
  }

  const item = await prisma.foodItem.create({
    data: {
      ...rest,
      restaurantId: restaurant.id,
      menuCategoryId,
      images: images?.length ? { create: images.map((url: string, i: number) => ({ url, position: i })) } : undefined,
      addOns: addOns?.length ? { create: addOns } : undefined,
    },
    include: { images: true, addOns: true },
  });

  sendCreated(res, item);
});

export const updateFoodItem = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const item = await prisma.foodItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.restaurantId !== restaurant.id) throw AppError.notFound("Food item not found");

  const { images, addOns, ...rest } = req.body;
  const updated = await prisma.foodItem.update({
    where: { id: req.params.id },
    data: rest,
    include: { images: true, addOns: true },
  });
  sendSuccess(res, updated);
});

export const deleteFoodItem = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const item = await prisma.foodItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.restaurantId !== restaurant.id) throw AppError.notFound("Food item not found");

  await prisma.foodItem.delete({ where: { id: req.params.id } });
  sendNoContent(res);
});

export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await requireOwnedRestaurant(req.user!.id);
  const item = await prisma.foodItem.findUnique({ where: { id: req.params.id } });
  if (!item || item.restaurantId !== restaurant.id) throw AppError.notFound("Food item not found");

  const updated = await prisma.foodItem.update({
    where: { id: req.params.id },
    data: { isAvailable: !item.isAvailable },
  });
  sendSuccess(res, updated);
});
