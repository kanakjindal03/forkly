import { PrismaClient, RestaurantStatus, Role } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isPopular?: boolean;
  calories?: number;
};

type SeedRestaurant = {
  ownerName: string;
  ownerEmail: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  categories: string[];
  addressLine: string;
  city: string;
  priceLevel: number;
  avgRating: number;
  reviewCount: number;
  imageUrl: string;
  menus: Array<{ name: string; items: SeedItem[] }>;
};

const BANNER_URL =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";

const restaurants: SeedRestaurant[] = [
  {
    ownerName: "Basil Owner",
    ownerEmail: "owner@basilandbloom.com",
    name: "Basil & Bloom",
    slug: "basil-and-bloom",
    description: "Wood-fired pizza and handmade pasta.",
    cuisine: "Italian",
    categories: ["Pizza"],
    addressLine: "42 Cedar Lane, Downtown",
    city: "Springfield",
    priceLevel: 2,
    avgRating: 4.7,
    reviewCount: 238,
    imageUrl: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=80",
    menus: [],
  },
  {
    ownerName: "Wei Chen",
    ownerEmail: "owner@goldenwok.com",
    name: "Golden Wok",
    slug: "golden-wok",
    description: "Sizzling stir-fry, noodles and handcrafted dim sum.",
    cuisine: "Chinese",
    categories: ["Asian"],
    addressLine: "18 Orchid Street, Midtown",
    city: "Springfield",
    priceLevel: 2,
    avgRating: 4.5,
    reviewCount: 512,
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900&q=80",
    menus: [
      {
        name: "Noodles & Rice",
        items: [
          { name: "Kung Pao Noodles", price: 10.99, description: "Wok-tossed noodles, peanuts and dried chilli.", isVeg: true, isPopular: true, calories: 690 },
          { name: "Sweet & Sour Chicken", price: 12.99, description: "Crispy chicken, pineapple and bell pepper.", isVeg: false, calories: 780 },
          { name: "Egg Fried Rice", price: 8.99, description: "Classic wok-fried rice with scallion and egg.", isVeg: true, calories: 520 },
        ],
      },
      {
        name: "Starters",
        items: [
          { name: "Vegetable Spring Rolls", price: 6.99, description: "Six crispy rolls with sweet chilli dip.", isVeg: true, calories: 340 },
        ],
      },
    ],
  },
  {
    ownerName: "Arjun Mehta",
    ownerEmail: "owner@spiceroute.com",
    name: "Spice Route",
    slug: "spice-route",
    description: "Regional Indian curries, biryani and tandoor favourites.",
    cuisine: "Indian",
    categories: ["Indian"],
    addressLine: "7 Saffron Road, Old Town",
    city: "Springfield",
    priceLevel: 2,
    avgRating: 4.8,
    reviewCount: 890,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=80",
    menus: [
      {
        name: "Curries",
        items: [
          { name: "Butter Chicken", price: 13.99, description: "Tandoori chicken in a rich tomato-cashew gravy.", isVeg: false, isPopular: true, calories: 720 },
          { name: "Paneer Tikka Masala", price: 12.49, description: "Grilled paneer in a smoky masala gravy.", isVeg: true, calories: 640 },
          { name: "Dal Makhani", price: 9.99, description: "Slow-cooked black lentils finished with cream.", isVeg: true, calories: 480 },
        ],
      },
      {
        name: "Rice & Bread",
        items: [
          { name: "Chicken Biryani", price: 14.49, description: "Saffron basmati rice with slow-cooked chicken.", isVeg: false, isPopular: true, calories: 890 },
          { name: "Garlic Naan", price: 3.49, description: "Charred flatbread brushed with garlic butter.", isVeg: true, calories: 290 },
        ],
      },
    ],
  },
  {
    ownerName: "Tom Bradley",
    ownerEmail: "owner@pattyhouse.com",
    name: "Patty House",
    slug: "patty-house",
    description: "Smash burgers, loaded fries and thick shakes.",
    cuisine: "American",
    categories: ["Fast Food"],
    addressLine: "101 Maple Avenue, Uptown",
    city: "Springfield",
    priceLevel: 1,
    avgRating: 4.6,
    reviewCount: 674,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    menus: [
      {
        name: "Burgers",
        items: [
          { name: "Classic Smash Burger", price: 9.99, description: "Double smash patty, cheddar and house sauce.", isVeg: false, isPopular: true, calories: 860 },
          { name: "BBQ Bacon Burger", price: 11.49, description: "Smoked bacon, barbecue glaze and onion rings.", isVeg: false, calories: 970 },
          { name: "Veggie Deluxe", price: 9.49, description: "Black bean patty, avocado and chipotle mayo.", isVeg: true, calories: 610 },
        ],
      },
      {
        name: "Sides & Shakes",
        items: [
          { name: "Loaded Fries", price: 6.49, description: "Fries with cheese sauce, bacon bits and scallion.", isVeg: false, isPopular: true, calories: 540 },
          { name: "Chocolate Milkshake", price: 5.99, description: "Belgian chocolate shake with whipped cream.", isVeg: true, calories: 480 },
        ],
      },
    ],
  },
  {
    ownerName: "Yuki Tanaka",
    ownerEmail: "owner@sakurasushi.com",
    name: "Sakura Sushi Bar",
    slug: "sakura-sushi-bar",
    description: "Precision-made sushi rolls and comforting ramen.",
    cuisine: "Japanese",
    categories: ["Japanese", "Asian"],
    addressLine: "5 Harbor Walk, Bayside",
    city: "Springfield",
    priceLevel: 3,
    avgRating: 4.9,
    reviewCount: 321,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&q=80",
    menus: [
      {
        name: "Sushi Rolls",
        items: [
          { name: "California Roll", price: 9.99, description: "Crab, avocado, cucumber and tobiko.", isVeg: false, isPopular: true, calories: 380 },
          { name: "Spicy Tuna Roll", price: 11.49, description: "Tuna, sriracha mayo and scallion.", isVeg: false, calories: 410 },
          { name: "Avocado Cucumber Roll", price: 8.49, description: "Avocado, cucumber and toasted sesame.", isVeg: true, calories: 310 },
        ],
      },
      {
        name: "Ramen",
        items: [
          { name: "Tonkotsu Ramen", price: 14.99, description: "Pork broth, chashu, soft egg and scallion.", isVeg: false, isPopular: true, calories: 820 },
          { name: "Miso Tofu Ramen", price: 13.49, description: "Miso broth, corn, bean sprouts and tofu.", isVeg: true, calories: 690 },
        ],
      },
    ],
  },
  {
    ownerName: "Layla Haddad",
    ownerEmail: "owner@greenbowl.com",
    name: "Green Bowl Co.",
    slug: "green-bowl-co",
    description: "Nourishing grain bowls, salads and fresh smoothies.",
    cuisine: "Healthy",
    categories: ["Healthy"],
    addressLine: "29 Willow Court, Riverside",
    city: "Springfield",
    priceLevel: 2,
    avgRating: 4.4,
    reviewCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80",
    menus: [
      {
        name: "Bowls & Salads",
        items: [
          { name: "Quinoa Power Bowl", price: 11.99, description: "Quinoa, chickpea, kale and tahini dressing.", isVeg: true, isPopular: true, calories: 520 },
          { name: "Mediterranean Bowl", price: 12.49, description: "Falafel, hummus, tabbouleh and feta.", isVeg: true, calories: 560 },
          { name: "Greek Salad", price: 9.49, description: "Cucumber, olives, feta and oregano.", isVeg: true, calories: 380 },
        ],
      },
      {
        name: "Smoothies",
        items: [
          { name: "Berry Blast Smoothie", price: 6.99, description: "Mixed berries, banana and almond milk.", isVeg: true, isPopular: true, calories: 240 },
        ],
      },
    ],
  },
  {
    ownerName: "Sofia Alvarez",
    ownerEmail: "owner@tacofiesta.com",
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    description: "Colourful street-style tacos and Mexican favourites.",
    cuisine: "Mexican",
    categories: ["Mexican", "Fast Food"],
    addressLine: "63 Fiesta Boulevard, Southside",
    city: "Springfield",
    priceLevel: 1,
    avgRating: 4.6,
    reviewCount: 405,
    imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=900&q=80",
    menus: [
      {
        name: "Tacos",
        items: [
          { name: "Chicken Tacos", price: 9.49, description: "Grilled chicken, pico de gallo and lime crema.", isVeg: false, isPopular: true, calories: 560 },
          { name: "Beef Barbacoa Tacos", price: 10.49, description: "Slow-braised beef, onion and cilantro.", isVeg: false, calories: 610 },
          { name: "Veggie Tacos", price: 8.49, description: "Grilled vegetables, black beans and chipotle sauce.", isVeg: true, calories: 460 },
        ],
      },
      {
        name: "Sides",
        items: [
          { name: "Loaded Nachos", price: 8.99, description: "Queso, jalapeno, guacamole and salsa.", isVeg: true, isPopular: true, calories: 720 },
        ],
      },
    ],
  },
  {
    ownerName: "Emma Baker",
    ownerEmail: "owner@sweettooth.com",
    name: "Sweet Tooth Bakery",
    slug: "sweet-tooth-bakery",
    description: "Fresh cakes, laminated pastries and speciality coffee.",
    cuisine: "Desserts",
    categories: ["Desserts"],
    addressLine: "12 Bakery Row, Old Town",
    city: "Springfield",
    priceLevel: 2,
    avgRating: 4.7,
    reviewCount: 267,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=80",
    menus: [
      {
        name: "Cakes & Pastries",
        items: [
          { name: "Chocolate Truffle Slice", price: 6.49, description: "Dark chocolate ganache and cocoa nibs.", isVeg: true, isPopular: true, calories: 480 },
          { name: "Red Velvet Slice", price: 6.49, description: "Velvet sponge with cream-cheese frosting.", isVeg: true, calories: 460 },
          { name: "Butter Croissant", price: 4.49, description: "Golden, flaky croissant made with cultured butter.", isVeg: true, calories: 320 },
        ],
      },
      {
        name: "Drinks",
        items: [
          { name: "Iced Vanilla Latte", price: 4.99, description: "Double espresso, cold milk and vanilla.", isVeg: true, calories: 190 },
        ],
      },
    ],
  },
];

async function seedRestaurants() {
  console.log("Seeding restaurant catalogue...");
  const ownerPassword = await hashPassword("Owner123!");

  for (const entry of restaurants) {
    const owner = await prisma.user.upsert({
      where: { email: entry.ownerEmail },
      update: { name: entry.ownerName, role: Role.RESTAURANT_OWNER, isActive: true },
      create: {
        name: entry.ownerName,
        email: entry.ownerEmail,
        passwordHash: ownerPassword,
        role: Role.RESTAURANT_OWNER,
      },
    });

    const restaurant = await prisma.restaurant.upsert({
      where: { ownerId: owner.id },
      update: {
        name: entry.name,
        description: entry.description,
        cuisine: entry.cuisine,
        logoUrl: entry.imageUrl,
        bannerUrl: BANNER_URL,
        addressLine: entry.addressLine,
        city: entry.city,
        status: RestaurantStatus.ACTIVE,
        priceLevel: entry.priceLevel,
        avgRating: entry.avgRating,
        reviewCount: entry.reviewCount,
      },
      create: {
        ownerId: owner.id,
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        cuisine: entry.cuisine,
        logoUrl: entry.imageUrl,
        bannerUrl: BANNER_URL,
        addressLine: entry.addressLine,
        city: entry.city,
        status: RestaurantStatus.ACTIVE,
        priceLevel: entry.priceLevel,
        avgRating: entry.avgRating,
        reviewCount: entry.reviewCount,
      },
    });

    const categoryRows = await prisma.category.findMany({
      where: { name: { in: entry.categories } },
    });

    if (categoryRows.length) {
      await prisma.restaurantCategory.createMany({
        data: categoryRows.map((category) => ({
          restaurantId: restaurant.id,
          categoryId: category.id,
        })),
        skipDuplicates: true,
      });
    }

    const existingMenuCount = await prisma.menuCategory.count({
      where: { restaurantId: restaurant.id },
    });

    if (existingMenuCount === 0) {
      for (const [position, menu] of entry.menus.entries()) {
        const menuCategory = await prisma.menuCategory.create({
          data: {
            restaurantId: restaurant.id,
            name: menu.name,
            position,
          },
        });

        for (const item of menu.items) {
          await prisma.foodItem.create({
            data: {
              restaurantId: restaurant.id,
              menuCategoryId: menuCategory.id,
              name: item.name,
              price: item.price,
              description: item.description,
              isVeg: item.isVeg,
              isPopular: item.isPopular ?? false,
              calories: item.calories,
              images: {
                create: [{ url: entry.imageUrl, position: 0 }],
              },
            },
          });
        }
      }
    }

    console.log(`  Ready: ${restaurant.name}`);
  }

  console.log("Restaurant catalogue seed complete.");
}

seedRestaurants()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });