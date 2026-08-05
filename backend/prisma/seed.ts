import {
  DeliveryPartnerStatus,
  PrismaClient,
  Role,
  RestaurantStatus,
} from "@prisma/client";

import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Forkly database...");

  const seedRestaurantId =
  "00000000-0000-0000-0000-000000000002";

  const adminPassword = await hashPassword("Admin123!");
  const admin = await prisma.user.upsert({
    where: { email: "admin@forkly.dev" },
    update: {},
    create: { name: "Forkly Admin", email: "admin@forkly.dev", passwordHash: adminPassword, role: Role.ADMIN },
  });

  const ownerPassword = await hashPassword("Owner123!");
  const owner = await prisma.user.upsert({
    where: { email: "owner@basilandbloom.com" },
    update: {},
    create: { name: "Basil Owner", email: "owner@basilandbloom.com", passwordHash: ownerPassword, role: Role.RESTAURANT_OWNER },
  });

  const customerPassword = await hashPassword("Customer123!");
  const customer = await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: { name: "Priya Nair", email: "priya@example.com", passwordHash: customerPassword, role: Role.CUSTOMER },
  });

  const deliveryPassword = await hashPassword(
  "Delivery123!"
);

const deliveryUser = await prisma.user.upsert({
  where: {
    email: "delivery@forkly.dev",
  },
  update: {
    name: "Diego Marquez",
    role: Role.DELIVERY_PARTNER,
    isActive: true,
  },
  create: {
    name: "Diego Marquez",
    email: "delivery@forkly.dev",
    passwordHash: deliveryPassword,
    role: Role.DELIVERY_PARTNER,
  },
});

await prisma.deliveryPartner.upsert({
  where: {
    userId: deliveryUser.id,
  },
  update: {
    vehicleType: "Scooter",
    status: DeliveryPartnerStatus.ACTIVE,
    isAvailable: true,
    rating: 4.9,
  },
  create: {
    userId: deliveryUser.id,
    vehicleType: "Scooter",
    status: DeliveryPartnerStatus.ACTIVE,
    isAvailable: true,
    rating: 4.9,
  },
});

const pendingOwnerPassword =
  await hashPassword("Pending123!");

const pendingOwner =
  await prisma.user.upsert({
    where: {
      email: "owner@cedarandsage.com",
    },
    update: {
      name: "Layla Haddad",
      role: Role.RESTAURANT_OWNER,
      isActive: true,
    },
    create: {
      name: "Layla Haddad",
      email: "owner@cedarandsage.com",
      passwordHash: pendingOwnerPassword,
      role: Role.RESTAURANT_OWNER,
    },
  });

await prisma.restaurant.upsert({
  where: {
    ownerId: pendingOwner.id,
  },
  update: {
    status: RestaurantStatus.PENDING,
  },
  create: {
    ownerId: pendingOwner.id,
    name: "Cedar & Sage",
    slug: "cedar-and-sage",
    description:
      "Fresh Mediterranean food and seasonal dishes.",
    cuisine: "Mediterranean",
    addressLine: "18 Garden Avenue",
    city: "Springfield",
    email: "owner@cedarandsage.com",
    status: RestaurantStatus.PENDING,
  },
});

const pendingDriverPassword =
  await hashPassword("Pending123!");

const pendingDriverUser =
  await prisma.user.upsert({
    where: {
      email: "driver.pending@forkly.dev",
    },
    update: {
      name: "Maya Singh",
      role: Role.DELIVERY_PARTNER,
      isActive: true,
    },
    create: {
      name: "Maya Singh",
      email: "driver.pending@forkly.dev",
      passwordHash: pendingDriverPassword,
      role: Role.DELIVERY_PARTNER,
    },
  });

await prisma.deliveryPartner.upsert({
  where: {
    userId: pendingDriverUser.id,
  },
  update: {
    vehicleType: "Electric Bike",
    status: DeliveryPartnerStatus.PENDING,
    isAvailable: false,
  },
  create: {
    userId: pendingDriverUser.id,
    vehicleType: "Electric Bike",
    status: DeliveryPartnerStatus.PENDING,
    isAvailable: false,
  },
});

  const categoryNames = ["Fast Food", "Pizza", "Healthy", "Asian", "Indian", "Japanese", "Mexican", "Desserts"];
  const categories = await Promise.all(
    categoryNames.map((name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } }))
  );
  const pizzaCategory = categories.find((c) => c.name === "Pizza")!;

  const restaurant = await prisma.restaurant.upsert({
    where: { ownerId: owner.id },
    update: {},
    create: {
      id: seedRestaurantId,
      ownerId: owner.id,
      name: "Basil & Bloom",
      slug: "basil-and-bloom",
      description: "Wood-fired pizza and handmade pasta.",
      cuisine: "Italian",
      addressLine: "42 Cedar Lane, Downtown",
      city: "Springfield",
      status: RestaurantStatus.ACTIVE,
      avgRating: 4.7,
      reviewCount: 238,
      restaurantCategories: { create: [{ categoryId: pizzaCategory.id }] },
      menuCategories: {
        create: [
          {
            name: "Pizzas",
            position: 0,
            foodItems: {
              create: [
                {restaurantId: seedRestaurantId, name: "Margherita Supreme", price: 12.99, description: "San Marzano tomato, buffalo mozzarella, basil", isVeg: true, isPopular: true },
                {restaurantId: seedRestaurantId, name: "Pepperoni Classic", price: 13.99, description: "Double pepperoni, mozzarella, chili honey", isVeg: false, isPopular: true },
              ],
            },
          },
          {
            name: "Pasta",
            position: 1,
            foodItems: {
              create: [
                {restaurantId: seedRestaurantId, name: "Truffle Alfredo", price: 14.99, description: "Fettuccine, cream, parmesan, black truffle", isVeg: true },
                {restaurantId: seedRestaurantId, name: "Arrabbiata Penne", price: 11.99, description: "Spicy tomato, garlic, chili, pecorino", isVeg: true },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FORK20" },
    update: {},
    create: { code: "FORK20", description: "20% off, up to $6", discountType: "PERCENTAGE", value: 20, maxDiscount: 6 },
  });
  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: { code: "FREESHIP", description: "Free delivery on any order", discountType: "FREE_DELIVERY", value: 0 },
  });

  await prisma.address.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: customer.id,
      label: "Home",
      line1: "221B Baker Street, Apt 4",
      city: "Springfield",
      isDefault: true,
    },
  });

  console.log("Seed complete:");
  console.log(`  Admin login:    admin@forkly.dev / Admin123!`);
  console.log(`  Owner login:    owner@basilandbloom.com / Owner123!`);
  console.log(`  Customer login: priya@example.com / Customer123!`);
  console.log(`  Restaurant:     ${restaurant.name} (${restaurant.slug})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
