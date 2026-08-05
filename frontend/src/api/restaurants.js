import { apiRequest } from "./client.js";

const DEFAULT_RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80";

const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&q=80";

function createCategoryId(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function mapFoodItem(item) {
  return {
    id: item.id,
    name: item.name,
    price: Number(item.price),
    desc: item.description || "",
    img: item.images?.[0]?.url || DEFAULT_FOOD_IMAGE,
    veg: item.isVeg,
    popular: item.isPopular,
    available: item.isAvailable,
    spicy: false,
    calories: item.calories,
    addOns: (item.addOns || []).map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      price: Number(addOn.price),
    })),
  };
}

export function mapRestaurant(restaurant) {
  return {
    id: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,
    tagline: restaurant.description || "",
    cuisine: restaurant.cuisine,

    categoryIds: (
      restaurant.restaurantCategories || []
    ).map((entry) =>
      createCategoryId(entry.category?.name)
    ),

    rating: Number(restaurant.avgRating || 0),
    reviewCount: restaurant.reviewCount || 0,
    priceLevel: "$".repeat(restaurant.priceLevel || 2),

    time: "25-30 min",
    distance: "Nearby",
    veg: "both",

    image:
      restaurant.logoUrl || DEFAULT_RESTAURANT_IMAGE,
    banner:
      restaurant.bannerUrl || DEFAULT_RESTAURANT_IMAGE,

    address: [
      restaurant.addressLine,
      restaurant.city,
    ]
      .filter(Boolean)
      .join(", "),

    offer: null,

    menu: (restaurant.menuCategories || []).map(
      (category) => ({
        id: category.id,
        name: category.name,
        items: (category.foodItems || []).map(
          mapFoodItem
        ),
      })
    ),
  };
}

export async function getRestaurants() {
  const restaurants = await apiRequest(
    "/restaurants?limit=50"
  );

  return restaurants.map(mapRestaurant);
}

export async function getRestaurant(idOrSlug) {
  const restaurant = await apiRequest(
    `/restaurants/${idOrSlug}`
  );

  return mapRestaurant(restaurant);
}
export async function getRestaurantReviews(
  restaurantId
) {
  const response = await fetch(
    `${API_URL}/restaurants/${restaurantId}/reviews?limit=20`
  );

  const result = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Unable to load restaurant reviews"
    );
  }

  return result.data || [];
}