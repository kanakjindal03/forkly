import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess, sendNoContent } from "../utils/apiResponse";

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, avatarUrl } = req.body as { name?: string; phone?: string; avatarUrl?: string };
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone, avatarUrl },
  });
  sendSuccess(res, user);
});

// ---- Addresses ----

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  sendSuccess(res, addresses);
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data: { ...req.body, userId: req.user!.id } });
  sendCreated(res, address);
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address || address.userId !== req.user!.id) throw AppError.notFound("Address not found");

  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }
  const updated = await prisma.address.update({ where: { id: req.params.id }, data: req.body });
  sendSuccess(res, updated);
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await prisma.address.findUnique({ where: { id: req.params.id } });
  if (!address || address.userId !== req.user!.id) throw AppError.notFound("Address not found");

  await prisma.address.delete({ where: { id: req.params.id } });
  sendNoContent(res);
});

// ---- Favorites ----

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.id },
    include: { restaurant: true, foodItem: true },
    orderBy: { createdAt: "desc" },
  });
  sendSuccess(res, favorites);
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, foodItemId } = req.body as { restaurantId?: string; foodItemId?: string };
  if (!restaurantId && !foodItemId) {
    throw AppError.badRequest("Provide either restaurantId or foodItemId");
  }
  const favorite = await prisma.favorite.create({
    data: { userId: req.user!.id, restaurantId, foodItemId },
  });
  sendCreated(res, favorite);
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const favorite = await prisma.favorite.findUnique({ where: { id: req.params.id } });
  if (!favorite || favorite.userId !== req.user!.id) throw AppError.notFound("Favorite not found");

  await prisma.favorite.delete({ where: { id: req.params.id } });
  sendNoContent(res);
});

// ---- Notifications ----

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  sendSuccess(res, notifications);
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notification || notification.userId !== req.user!.id) throw AppError.notFound("Notification not found");

  const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
  sendSuccess(res, updated);
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
  sendSuccess(res, { message: "All notifications marked as read" });
});
