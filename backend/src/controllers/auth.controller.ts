import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { sendCreated, sendSuccess } from "../utils/apiResponse";
import { hashPassword, comparePassword } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import {
  RegisterInput,
  LoginInput,
  GoogleAuthInput,
  RestaurantOwnerApplicationInput,
  DeliveryPartnerApplicationInput,
} from "../validators/auth.validators";

const googleClient =
  new OAuth2Client();
function toAuthUser(user: { id: string; name: string; email: string; role: string; avatarUrl: string | null }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl };
}
function createRestaurantSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "restaurant";

  return `${base}-${Date.now().toString(
    36
  )}-${Math.random().toString(36).slice(2, 6)}`;
}
export const registerRestaurantOwner =
  asyncHandler(
    async (req: Request, res: Response) => {
      const input =
        req.body as RestaurantOwnerApplicationInput;

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });

      if (existingUser) {
        throw AppError.conflict(
          "An account with this email already exists"
        );
      }

      const passwordHash = await hashPassword(
        input.password
      );

      const result = await prisma.$transaction(
        async (transaction) => {
          const user =
            await transaction.user.create({
              data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                passwordHash,
                role: "RESTAURANT_OWNER",
                isActive: false,
              },
            });

          const restaurant =
            await transaction.restaurant.create({
              data: {
                ownerId: user.id,
                name: input.restaurantName,
                slug: createRestaurantSlug(
                  input.restaurantName
                ),
                description:
                  input.description || null,
                cuisine: input.cuisine,
                addressLine: input.addressLine,
                city: input.city,
                phone:
                  input.restaurantPhone ||
                  input.phone,
                email:
                  input.restaurantEmail ||
                  input.email,
                status: "PENDING",
              },
            });

          return {
            user,
            restaurant,
          };
        }
      );

      sendCreated(res, {
        message:
          "Restaurant application submitted successfully",
        application: {
          id: result.restaurant.id,
          restaurantName:
            result.restaurant.name,
          status: result.restaurant.status,
          ownerEmail: result.user.email,
        },
      });
    }
  );

  export const registerDeliveryPartner =
  asyncHandler(
    async (req: Request, res: Response) => {
      const input =
        req.body as DeliveryPartnerApplicationInput;

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });

      if (existingUser) {
        throw AppError.conflict(
          "An account with this email already exists"
        );
      }

      const passwordHash = await hashPassword(
        input.password
      );

      const result = await prisma.$transaction(
        async (transaction) => {
          const user =
            await transaction.user.create({
              data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                passwordHash,
                role: "DELIVERY_PARTNER",
                isActive: false,
              },
            });

          const partner =
            await transaction.deliveryPartner.create({
              data: {
                userId: user.id,
                vehicleType: input.vehicleType,
                vehicleNumber: input.vehicleNumber,
                licenseNumber: input.licenseNumber,
                status: "PENDING",
                isAvailable: false,
              },
            });

          return {
            user,
            partner,
          };
        }
      );

      sendCreated(res, {
        message:
          "Delivery partner application submitted successfully",
        application: {
          id: result.partner.id,
          applicantName: result.user.name,
          email: result.user.email,
          vehicleType:
            result.partner.vehicleType,
          status: result.partner.status,
        },
      });
    }
  );
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body as RegisterInput;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw AppError.conflict("An account with this email already exists");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash, role },
  });

  // Delivery partners and restaurant owners start in a pending state until an
  // admin approves their application (partner/restaurant record created separately).
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  sendCreated(res, { user: toAuthUser(user), accessToken, refreshToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user =
  await prisma.user.findUnique({
    where: { email },
  });

if (!user || !user.passwordHash) {
  throw AppError.unauthorized(
    "Invalid email or password"
  );
}

const valid = await comparePassword(
  password,
  user.passwordHash
);
  if (!valid) throw AppError.unauthorized("Invalid email or password");

  if (
  !user.isActive &&
  user.role === "RESTAURANT_OWNER"
) {
  const restaurant =
    await prisma.restaurant.findUnique({
      where: {
        ownerId: user.id,
      },
      select: {
        status: true,
      },
    });

  if (restaurant?.status === "PENDING") {
    throw AppError.forbidden(
      "Your restaurant application is awaiting Admin approval"
    );
  }

  if (restaurant?.status === "REJECTED") {
    throw AppError.forbidden(
      "Your restaurant application was not approved"
    );
  }

  if (restaurant?.status === "SUSPENDED") {
    throw AppError.forbidden(
      "Your restaurant has been suspended"
    );
  }
}
if (
  !user.isActive &&
  user.role === "DELIVERY_PARTNER"
) {
  const partner =
    await prisma.deliveryPartner.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
      },
    });

  if (partner?.status === "PENDING") {
    throw AppError.forbidden(
      "Your delivery partner application is awaiting Admin approval"
    );
  }

  if (partner?.status === "SUSPENDED") {
    throw AppError.forbidden(
      "Your delivery partner account is not active"
    );
  }
}

  if (!user.isActive) throw AppError.forbidden("This account has been suspended");

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  sendSuccess(res, { user: toAuthUser(user), accessToken, refreshToken });
});

export const googleAuth =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { credential } =
        req.body as GoogleAuthInput;

      if (!env.googleClientId) {
        throw new Error(
          "GOOGLE_CLIENT_ID is not configured"
        );
      }

      let payload;

      try {
        const ticket =
          await googleClient.verifyIdToken({
            idToken: credential,
            audience:
              env.googleClientId,
          });

        payload = ticket.getPayload();
      } catch {
        throw AppError.unauthorized(
          "Google sign-in could not be verified"
        );
      }

      if (
        !payload?.sub ||
        !payload.email ||
        payload.email_verified !== true
      ) {
        throw AppError.unauthorized(
          "Google account email could not be verified"
        );
      }

      const googleId = payload.sub;

      const email = payload.email
        .trim()
        .toLowerCase();

      const googleName =
        payload.name?.trim() ||
        email.split("@")[0];

      const googleAvatar =
        payload.picture || null;

      let user =
        await prisma.user.findUnique({
          where: {
            googleId,
          },
        });

      if (!user) {
        const existingEmailUser =
          await prisma.user.findFirst({
            where: {
              email: {
                equals: email,
                mode: "insensitive",
              },
            },
          });

        if (existingEmailUser) {
          if (
            existingEmailUser.role !==
            "CUSTOMER"
          ) {
            throw AppError.forbidden(
              "Google sign-in is available only for customer accounts"
            );
          }

          if (
            !existingEmailUser.isActive
          ) {
            throw AppError.forbidden(
              "This account has been suspended"
            );
          }

          if (
            existingEmailUser.googleId &&
            existingEmailUser.googleId !==
              googleId
          ) {
            throw AppError.conflict(
              "This email is already linked to another Google account"
            );
          }

          user =
            await prisma.user.update({
              where: {
                id: existingEmailUser.id,
              },
              data: {
                googleId,
                avatarUrl:
                  existingEmailUser.avatarUrl ||
                  googleAvatar,
              },
            });
        } else {
          user =
            await prisma.user.create({
              data: {
                name: googleName,
                email,
                passwordHash: null,
                googleId,
                avatarUrl:
                  googleAvatar,
                role: "CUSTOMER",
                isActive: true,
              },
            });
        }
      }

      if (user.role !== "CUSTOMER") {
        throw AppError.forbidden(
          "Google sign-in is available only for customer accounts"
        );
      }

      if (!user.isActive) {
        throw AppError.forbidden(
          "This account has been suspended"
        );
      }

      const accessToken =
        signAccessToken({
          sub: user.id,
          role: user.role,
        });

      const refreshToken =
        signRefreshToken({
          sub: user.id,
          role: user.role,
        });

      sendSuccess(res, {
        user: toAuthUser(user),
        accessToken,
        refreshToken,
      });
    }
  );

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw AppError.unauthorized("Account is inactive or no longer exists");

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user.id, role: user.role });

  sendSuccess(res, { accessToken, refreshToken: newRefreshToken });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
  sendSuccess(res, toAuthUser(user));
});

/**
 * Forgot/reset password are implemented as no-op-safe stubs: they always respond
 * successfully (never confirming whether an email exists) and log what a real
 * implementation would email out. Wire up a mail provider (see README) to go live.
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    // TODO: generate a signed, short-lived reset token and email it via your provider.
  }
  sendSuccess(res, { message: "If an account with that email exists, a reset link has been sent." });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  // TODO: verify the reset token issued by forgotPassword before allowing this.
  throw AppError.badRequest("Password reset tokens are not enabled in this demo backend.");
});
