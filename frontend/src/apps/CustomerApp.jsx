import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiRequest } from "../api/client.js";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  createOrder,
  getMyOrders,
  getOrder,
  createReview,
} from "../api/orders.js";
import {
  getRestaurants,
  getRestaurant,
    getRestaurantReviews,
} from "../api/restaurants.js";
import {
  getActiveCoupons,
} from "../api/coupons.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notifications.js";
import {
  Search, MapPin, Star, Clock, ShoppingBag, Heart, User, Sun, Moon, Menu, X,
  Plus, Minus, ChevronRight, ChevronLeft, ChevronDown, SlidersHorizontal, Check,
  ArrowLeft, Bell, LogOut, CreditCard, Wallet, Banknote, Truck, ChefHat, Package,
  CheckCircle2, Home, UtensilsCrossed, Award, TrendingUp, Percent, ShieldCheck,
  Phone, MessageCircle, Trash2, Flame, Leaf, Loader2, Tag, Sparkles, ArrowRight,
  Store, Mail, Lock, Eye, EyeOff, Plus as PlusCircle, RotateCcw, ThumbsUp, MapPinned,
Pizza,
Salad,
Soup,
Fish,
Sandwich,
CakeSlice,
CookingPot,
} from "lucide-react";

/* =========================================================================
   THEME TOKENS
   ========================================================================= */
const THEMES = {
  dark: {
    mode: "dark",
    bg: "#0B0F19",
    bgAlt: "#0E1320",
    bgElevated: "#11162280",
    card: "#151A24",
    cardHover: "#1A2130",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.14)",
    primary: "#FF6B35",
    primaryHover: "#FF8555",
    primarySoft: "rgba(255,107,53,0.14)",
    accent: "#FFC857",
    accentSoft: "rgba(255,200,87,0.14)",
    success: "#22C55E",
    successSoft: "rgba(34,197,94,0.14)",
    error: "#EF4444",
    errorSoft: "rgba(239,68,68,0.14)",
    text: "#FFFFFF",
    textMuted: "#9CA3AF",
    textFaint: "#6B7280",
    shadow: "0 20px 50px rgba(0,0,0,0.45)",
    shadowSoft: "0 8px 24px rgba(0,0,0,0.3)",
    overlay: "rgba(5,7,12,0.72)",
    skeleton: "linear-gradient(90deg,#151A24 0%,#1c2230 50%,#151A24 100%)",
  },
  light: {
    mode: "light",
    bg: "#FBF8F3",
    bgAlt: "#F3EEE3",
    bgElevated: "#ffffff80",
    card: "#FFFFFF",
    cardHover: "#FFFCF6",
    border: "rgba(20,23,31,0.08)",
    borderStrong: "rgba(20,23,31,0.14)",
    primary: "#FF6B35",
    primaryHover: "#E85A2A",
    primarySoft: "rgba(255,107,53,0.10)",
    accent: "#E8A93D",
    accentSoft: "rgba(232,169,61,0.14)",
    success: "#16A34A",
    successSoft: "rgba(22,163,74,0.10)",
    error: "#DC2626",
    errorSoft: "rgba(220,38,38,0.10)",
    text: "#14171F",
    textMuted: "#6B6558",
    textFaint: "#948C7D",
    shadow: "0 20px 50px rgba(30,24,10,0.10)",
    shadowSoft: "0 8px 24px rgba(30,24,10,0.06)",
    overlay: "rgba(20,16,8,0.5)",
    skeleton: "linear-gradient(90deg,#F3EEE3 0%,#EAE3D3 50%,#F3EEE3 100%)",
  },
};

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* =========================================================================
   MOCK IMAGES (Unsplash CDN — graceful fallback handled by <FoodImage/>)
   ========================================================================= */
const IMG = {
  heroFood: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  pizza:
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",

pizza2:
  "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
  sushi: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
  sushi2: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  tacos: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
  pasta2: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&q=80",
  dessert: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  chicken: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
  ramen: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&q=80",
  curry: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  naan: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80",
  biryani: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&q=80",
  sandwich: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=600&q=80",
  interior: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
  cake: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  cupcake: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80",
  croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
  smoothie: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&q=80",
  bowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
  nachos: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
  avatar1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  avatar2: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  avatar3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  avatar4: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  courier: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
};

/* =========================================================================
   MOCK DATA
   ========================================================================= */
const CATEGORIES = [
  {
    id: "fastfood",
    name: "Fast Food",
    icon: "burger",
    image: IMG.burger,
    color: "#F97316",
    description:
      "Burgers, fries, wraps and quick bites",
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "pizza",
    image: IMG.pizza,
    color: "#EF4444",
    description:
      "Freshly baked pizzas with your favourite toppings",
  },
  {
    id: "healthy",
    name: "Healthy",
    icon: "salad",
    image: IMG.salad,
    color: "#22C55E",
    description:
      "Nutritious bowls, salads and fresh meals",
  },
  {
    id: "asian",
    name: "Asian",
    icon: "noodles",
    image: IMG.noodles,
    color: "#EAB308",
    description:
      "Noodles, dim sum and Asian favourites",
  },
  {
    id: "indian",
    name: "Indian",
    icon: "curry",
    image: IMG.curry,
    color: "#F59E0B",
    description:
      "Rich curries, biryani and traditional flavours",
  },
  {
    id: "japanese",
    name: "Japanese",
    icon: "sushi",
    image: IMG.sushi,
    color: "#EC4899",
    description:
      "Sushi, ramen and Japanese specialities",
  },
  {
    id: "mexican",
    name: "Mexican",
    icon: "taco",
    image: IMG.tacos,
    color: "#14B8A6",
    description:
      "Tacos, nachos and bold Mexican flavours",
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: "cake",
    image: IMG.dessert,
    color: "#A855F7",
    description:
      "Cakes, pastries and irresistible sweet treats",
  },
];

function mkItem(id, name, price, desc, img, extra) {
  return { id, name, price, desc, img, veg: false, popular: false, spicy: false, calories: null, addOns: [], ...extra };
}

const RESTAURANTS = [
  {
    id: "basil-bloom",
    name: "Basil & Bloom",
    tagline: "Wood-fired pizza & handmade pasta",
    cuisine: "Italian",
    categoryIds: ["pizza"],
    rating: 4.7,
    reviewCount: 238,
    time: "25-30 min",
    priceLevel: "$$",
    veg: "both",
    distance: "1.4 km",
    image: IMG.pizza,
    banner: IMG.interior,
    address: "42 Cedar Lane, Downtown",
    offer: "20% OFF up to $6",
    menu: [
      { name: "Pizzas", items: [
        mkItem("bb-1", "Margherita Supreme", 12.99, "San Marzano tomato, buffalo mozzarella, basil", IMG.pizza, { veg: true, popular: true, calories: 780 }),
        mkItem("bb-2", "Truffle Mushroom", 15.49, "Wild mushroom, truffle oil, fontina, thyme", IMG.pizza2, { veg: true, calories: 820, addOns: [{ name: "Extra truffle oil", price: 2 }] }),
        mkItem("bb-3", "Pepperoni Classic", 13.99, "Double pepperoni, mozzarella, chili honey", IMG.pizza2, { popular: true, calories: 910 }),
      ]},
      { name: "Pasta", items: [
        mkItem("bb-4", "Truffle Alfredo", 14.99, "Fettuccine, cream, parmesan, black truffle", IMG.pasta, { veg: true, calories: 860 }),
        mkItem("bb-5", "Arrabbiata Penne", 11.99, "Spicy tomato, garlic, chili, pecorino", IMG.pasta2, { veg: true, spicy: true, calories: 640 }),
        mkItem("bb-6", "Pesto Linguine", 12.49, "Basil pesto, pine nuts, cherry tomato", IMG.pasta, { veg: true, calories: 700 }),
      ]},
    ],
  },
  {
    id: "golden-wok",
    name: "Golden Wok",
    tagline: "Sizzling stir-fry & dim sum",
    cuisine: "Chinese • Asian",
    categoryIds: ["asian"],
    rating: 4.5,
    reviewCount: 512,
    time: "20-25 min",
    priceLevel: "$$",
    veg: "both",
    distance: "2.1 km",
    image: IMG.noodles,
    banner: IMG.interior,
    address: "18 Orchid Street, Midtown",
    offer: null,
    menu: [
      { name: "Noodles & Rice", items: [
        mkItem("gw-1", "Kung Pao Noodles", 10.99, "Wok-tossed noodles, peanuts, dried chili", IMG.noodles, { veg: true, spicy: true, popular: true, calories: 690 }),
        mkItem("gw-2", "Sweet & Sour Chicken", 12.99, "Crispy chicken, pineapple, bell pepper", IMG.chicken, { calories: 780 }),
        mkItem("gw-3", "Egg Fried Rice", 8.99, "Classic wok fried rice, scallion, egg", IMG.noodles, { veg: true, calories: 520 }),
      ]},
      { name: "Starters", items: [
        mkItem("gw-4", "Spring Rolls (6pc)", 6.99, "Crispy veg rolls, sweet chili dip", IMG.fries, { veg: true, calories: 340 }),
        mkItem("gw-5", "Steamed Dumplings", 8.49, "Pork & chive dumplings, soy vinegar", IMG.noodles, { popular: true, calories: 410 }),
      ]},
    ],
  },
  {
    id: "spice-route",
    name: "Spice Route",
    tagline: "Regional Indian curries & biryani",
    cuisine: "Indian",
    categoryIds: ["indian"],
    rating: 4.8,
    reviewCount: 890,
    time: "30-35 min",
    priceLevel: "$$",
    veg: "both",
    distance: "3.0 km",
    image: IMG.curry,
    banner: IMG.interior,
    address: "7 Saffron Road, Old Town",
    offer: "Free delivery over $25",
    menu: [
      { name: "Curries", items: [
        mkItem("sr-1", "Butter Chicken", 13.99, "Tandoori chicken, tomato-cashew gravy", IMG.curry, { popular: true, calories: 720 }),
        mkItem("sr-2", "Paneer Tikka Masala", 12.49, "Grilled paneer, smoky masala gravy", IMG.curry, { veg: true, calories: 640 }),
        mkItem("sr-3", "Dal Makhani", 9.99, "Slow-cooked black lentils, cream", IMG.curry, { veg: true, calories: 480 }),
      ]},
      { name: "Rice & Bread", items: [
        mkItem("sr-4", "Chicken Biryani", 14.49, "Basmati, saffron, slow-cooked chicken", IMG.biryani, { popular: true, spicy: true, calories: 890 }),
        mkItem("sr-5", "Veg Biryani", 11.99, "Basmati, seasonal vegetables, fried onion", IMG.biryani, { veg: true, calories: 650 }),
        mkItem("sr-6", "Garlic Naan", 3.49, "Charred flatbread, garlic butter", IMG.naan, { veg: true, calories: 290 }),
      ]},
    ],
  },
  {
    id: "patty-house",
    name: "Patty House",
    tagline: "Smash burgers done right",
    cuisine: "American • Burgers",
    categoryIds: ["fastfood"],
    rating: 4.6,
    reviewCount: 674,
    time: "15-20 min",
    priceLevel: "$",
    veg: "both",
    distance: "0.9 km",
    image: IMG.burger,
    banner: IMG.interior,
    address: "101 Maple Ave, Uptown",
    offer: "20% OFF your first order",
    menu: [
      { name: "Burgers", items: [
        mkItem("ph-1", "Classic Smash Burger", 9.99, "Double smash patty, cheddar, house sauce", IMG.burger, { popular: true, calories: 860 }),
        mkItem("ph-2", "BBQ Bacon Burger", 11.49, "Smoked bacon, BBQ glaze, onion rings", IMG.burger, { calories: 970 }),
        mkItem("ph-3", "Veggie Deluxe", 9.49, "Black bean patty, avocado, chipotle mayo", IMG.sandwich, { veg: true, calories: 610 }),
      ]},
      { name: "Sides & Shakes", items: [
        mkItem("ph-4", "Loaded Fries", 6.49, "Cheese sauce, bacon bits, scallion", IMG.fries, { popular: true, calories: 540 }),
        mkItem("ph-5", "Choco Milkshake", 5.99, "Belgian chocolate, whipped cream", IMG.shake, { veg: true, calories: 480 }),
      ]},
    ],
  },
  {
    id: "sakura-sushi",
    name: "Sakura Sushi Bar",
    tagline: "Precision rolls & ramen",
    cuisine: "Japanese",
    categoryIds: ["japanese", "asian"],
    rating: 4.9,
    reviewCount: 321,
    time: "25-30 min",
    priceLevel: "$$$",
    veg: "both",
    distance: "2.6 km",
    image: IMG.sushi,
    banner: IMG.interior,
    address: "5 Harbor Walk, Bayside",
    offer: null,
    menu: [
      { name: "Rolls", items: [
        mkItem("ss-1", "California Roll", 9.99, "Crab, avocado, cucumber, tobiko", IMG.sushi, { popular: true, calories: 380 }),
        mkItem("ss-2", "Spicy Tuna Roll", 11.49, "Tuna, sriracha mayo, scallion", IMG.sushi2, { spicy: true, calories: 410 }),
        mkItem("ss-3", "Dragon Roll", 13.99, "Eel, avocado, unagi glaze", IMG.sushi2, { popular: true, calories: 460 }),
      ]},
      { name: "Ramen", items: [
        mkItem("ss-4", "Tonkotsu Ramen", 14.99, "Pork broth, chashu, soft egg, scallion", IMG.ramen, { popular: true, calories: 820 }),
        mkItem("ss-5", "Miso Ramen", 13.49, "Miso broth, corn, bean sprout, tofu", IMG.ramen, { veg: true, calories: 690 }),
      ]},
    ],
  },
  {
    id: "green-bowl",
    name: "Green Bowl Co.",
    tagline: "Nourishing bowls & salads",
    cuisine: "Healthy • Salads",
    categoryIds: ["healthy"],
    rating: 4.4,
    reviewCount: 198,
    time: "15-20 min",
    priceLevel: "$$",
    veg: "veg",
    distance: "1.1 km",
    image: IMG.bowl,
    banner: IMG.interior,
    address: "29 Willow Court, Riverside",
    offer: "Free smoothie over $20",
    menu: [
      { name: "Bowls", items: [
        mkItem("gb-1", "Quinoa Power Bowl", 11.99, "Quinoa, chickpea, kale, tahini dressing", IMG.bowl, { veg: true, popular: true, calories: 520 }),
        mkItem("gb-2", "Mediterranean Bowl", 12.49, "Falafel, hummus, tabbouleh, feta", IMG.bowl, { veg: true, calories: 560 }),
      ]},
      { name: "Salads", items: [
        mkItem("gb-3", "Caesar Salad", 9.99, "Romaine, parmesan, garlic croutons", IMG.salad, { veg: true, calories: 410 }),
        mkItem("gb-4", "Greek Salad", 9.49, "Cucumber, olive, feta, oregano", IMG.salad, { veg: true, calories: 380 }),
      ]},
      { name: "Smoothies", items: [
        mkItem("gb-5", "Berry Blast Smoothie", 6.99, "Mixed berry, banana, almond milk", IMG.smoothie, { veg: true, popular: true, calories: 240 }),
      ]},
    ],
  },
  {
    id: "taco-fiesta",
    name: "Taco Fiesta",
    tagline: "Street-style Mexican favorites",
    cuisine: "Mexican",
    categoryIds: ["mexican"],
    rating: 4.6,
    reviewCount: 405,
    time: "20-25 min",
    priceLevel: "$",
    veg: "both",
    distance: "1.8 km",
    image: IMG.tacos,
    banner: IMG.interior,
    address: "63 Fiesta Blvd, Southside",
    offer: "Buy 2 Get 1 Free tacos",
    menu: [
      { name: "Tacos", items: [
        mkItem("tf-1", "Chicken Tacos (3pc)", 9.49, "Grilled chicken, pico de gallo, lime crema", IMG.tacos, { popular: true, calories: 560 }),
        mkItem("tf-2", "Beef Barbacoa Tacos (3pc)", 10.49, "Slow-braised beef, onion, cilantro", IMG.tacos, { spicy: true, calories: 610 }),
        mkItem("tf-3", "Veggie Tacos (3pc)", 8.49, "Grilled veg, black bean, chipotle sauce", IMG.tacos, { veg: true, calories: 460 }),
      ]},
      { name: "Sides", items: [
        mkItem("tf-4", "Loaded Nachos", 8.99, "Queso, jalapeño, guacamole, salsa", IMG.nachos, { veg: true, popular: true, calories: 720 }),
      ]},
    ],
  },
  {
    id: "sweet-tooth",
    name: "Sweet Tooth Bakery",
    tagline: "Cakes, pastries & coffee",
    cuisine: "Desserts • Bakery",
    categoryIds: ["desserts"],
    rating: 4.7,
    reviewCount: 267,
    time: "20 min",
    priceLevel: "$$",
    veg: "veg",
    distance: "1.3 km",
    image: IMG.cake,
    banner: IMG.interior,
    address: "12 Bakery Row, Old Town",
    offer: null,
    menu: [
      { name: "Cakes", items: [
        mkItem("st-1", "Chocolate Truffle Slice", 6.49, "Dark chocolate ganache, cocoa nibs", IMG.cake, { veg: true, popular: true, calories: 480 }),
        mkItem("st-2", "Red Velvet Slice", 6.49, "Cream cheese frosting, velvet sponge", IMG.cupcake, { veg: true, calories: 460 }),
      ]},
      { name: "Pastries & Drinks", items: [
        mkItem("st-3", "Butter Croissant", 4.49, "Laminated dough, 36 layers, golden crust", IMG.croissant, { veg: true, calories: 320 }),
        mkItem("st-4", "Iced Latte", 4.99, "Double espresso, cold milk, hint of vanilla", IMG.coffee, { veg: true, calories: 190 }),
      ]},
    ],
  },
];

const TESTIMONIALS = [
  { name: "Sarah Quinn", avatar: IMG.avatar1, rating: 5, text: "Forkly makes it so easy to get my favorite meals delivered fast and fresh." },
  { name: "James Kim", avatar: IMG.avatar2, rating: 5, text: "Great variety of restaurants and the delivery is always on time." },
  { name: "Belanie Torres", avatar: IMG.avatar3, rating: 4, text: "The best food delivery experience I've had so far. Highly recommend." },
];

const COUPONS = {
  "FORK20": { label: "20% off, up to $6", type: "percent", value: 0.2, cap: 6 },
  "FREESHIP": { label: "Free delivery", type: "shipping", value: 0 },
};

const SAVED_ADDRESSES = [
  { id: "addr-1", label: "Home", line: "221B Baker Street, Apt 4", city: "Springfield" },
  { id: "addr-2", label: "Work", line: "500 Market Square, Floor 9", city: "Springfield" },
];

const SAVED_CARDS = [
  { id: "card-1", brand: "Visa", last4: "4242", exp: "08/28" },
  { id: "card-2", brand: "Mastercard", last4: "8890", exp: "02/27" },
];

/* =========================================================================
   SMALL SHARED COMPONENTS
   ========================================================================= */
function FoodImage({ src, alt, style, className }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#FF6B35 0%,#FFC857 100%)",
        }}
      >
        <UtensilsCrossed size={28} color="#fff" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

function StarRating({ rating, size = 13, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <Star size={size} color={color || "#FFC857"} fill={color || "#FFC857"} />
      <span style={{ fontSize: size + 1, fontWeight: 600 }}>{rating}</span>
    </span>
  );
}

function Chip({ children, active, onClick, theme, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "6px 12px" : "9px 16px",
        borderRadius: 999,
        fontSize: small ? 12.5 : 13.5,
        fontWeight: 600,
        border: `1px solid ${active ? theme.primary : theme.border}`,
        background: active ? theme.primary : "transparent",
        color: active ? "#fff" : theme.text,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .15s ease",
        fontFamily: FONT_STACK,
      }}
    >
      {children}
    </button>
  );
}

function IconButton({ icon, onClick, theme, badge, label, size = 40 }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.card,
        border: `1px solid ${theme.border}`,
        color: theme.text,
        cursor: "pointer",
        transition: "transform .15s ease, background .15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon}
      {badge ? (
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            minWidth: 18,
            height: 18,
            padding: "0 4px",
            borderRadius: 999,
            background: "#FF6B35",
            color: "#fff",
            fontSize: 10.5,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${theme.bg}`,
          }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function PrimaryButton({ children, onClick, theme, full, disabled, size = "md", icon }) {
  const pad = size === "sm" ? "10px 18px" : size === "lg" ? "16px 28px" : "13px 22px";
  const fontSize = size === "sm" ? 13.5 : size === "lg" ? 16 : 14.5;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: pad,
        fontSize,
        fontWeight: 700,
        borderRadius: 14,
        border: "none",
        width: full ? "100%" : "auto",
        background: disabled ? theme.textFaint : theme.primary,
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "transform .15s ease, background .15s ease",
        fontFamily: FONT_STACK,
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {icon}{children}
    </button>
  );
}

function SectionHeading({ eyebrow, title, action, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        {eyebrow && (
          <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.primary, letterSpacing: 0.4, marginBottom: 4, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.4 }}>{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{ background: "none", border: "none", color: theme.textMuted, fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_STACK }}
        >
          {action.label} <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function Skeleton({ theme, height = 16, width = "100%", radius = 8 }) {
  return (
    <div
      style={{
        height, width, borderRadius: radius,
        background: theme.skeleton,
        backgroundSize: "200% 100%",
        animation: "forkly-shimmer 1.4s ease infinite",
      }}
    />
  );
}

/* =========================================================================
   HEADER
   ========================================================================= */
function Logo({ theme, onClick }) {
  return (
    <button
      type="button"
      className="forkly-customer-logo"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: FONT_STACK,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          borderRadius: 13,
          boxShadow:
            "0 9px 22px rgba(255,107,53,0.24)",
        }}
      >
        <UtensilsCrossed
          size={20}
          strokeWidth={2.3}
        />
      </div>

      <div
        style={{
          textAlign: "left",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            color: theme.text,
            fontSize: 21,
            fontWeight: 850,
            letterSpacing: -0.7,
          }}
        >
          Forkly
        </div>

        <div
          className="forkly-logo-tagline"
          style={{
            marginTop: 4,
            color: theme.textFaint,
            fontSize: 9.5,
            fontWeight: 650,
            letterSpacing: 0.2,
          }}
        >
          FOOD, DELIVERED HAPPY
        </div>
      </div>
    </button>
  );
}

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "restaurants",
    label: "Restaurants",
  },
  {
    id: "categories",
    label: "Categories",
  },
  {
    id: "offers",
    label: "Offers",
  },
];

function Header(props) {
  const {
    theme,
    mode,
    setMode,
    view,
    navigate,
    cartCount,
    favCount,
    isAuthed,
    user,
    onOpenCart,
    onOpenAuth,
    onOpenNotifications,
    unreadCount,
    celebrateDelivery,
    query,
    setQuery,
  } = props;

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [localQuery, setLocalQuery] =
    useState(query || "");

  useEffect(() => {
    setLocalQuery(query || "");
  }, [query]);

  useEffect(() => {
    setMobileOpen(false);
  }, [view]);

  const submitSearch = () => {
    setQuery(localQuery.trim());
    navigate("restaurants");
    setMobileOpen(false);
  };

  return (
    <header
      className="forkly-main-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background:
          mode === "dark"
            ? "rgba(11,15,25,0.9)"
            : "rgba(255,253,249,0.91)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: `1px solid ${theme.border}`,
        boxShadow:
          mode === "dark"
            ? "0 8px 25px rgba(0,0,0,0.2)"
            : "0 8px 30px rgba(48,36,17,0.055)",
      }}
    >
      <div
        className="forkly-header-inner"
        style={{
          width: "100%",
          maxWidth: 1280,
          minHeight: 72,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Logo
          theme={theme}
          onClick={() => navigate("home")}
        />

        <nav
          className="forkly-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginLeft: 10,
            padding: 4,
            background: theme.bgAlt,
            border: `1px solid ${theme.border}`,
            borderRadius: 13,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active =
              view === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  navigate(item.id)
                }
                style={{
                  padding: "8px 12px",
                  color: active
                    ? theme.primary
                    : theme.textMuted,
                  background: active
                    ? theme.card
                    : "transparent",
                  border: active
                    ? `1px solid ${theme.border}`
                    : "1px solid transparent",
                  borderRadius: 9,
                  boxShadow: active
                    ? theme.shadowSoft
                    : "none",
                  cursor: "pointer",
                  fontFamily: FONT_STACK,
                  fontSize: 13,
                  fontWeight: active
                    ? 750
                    : 600,
                  transition:
                    "color 0.2s ease, background 0.2s ease, transform 0.2s ease",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div
          className="forkly-desktop-search forkly-header-search"
          style={{
            width: 250,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 13px",
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            transition:
              "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <Search
            size={16}
            color={theme.textMuted}
          />

          <input
            value={localQuery}
            onChange={(event) =>
              setLocalQuery(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitSearch();
              }
            }}
            placeholder="Search food or restaurants"
            style={{
              width: "100%",
              minWidth: 0,
              color: theme.text,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: FONT_STACK,
              fontSize: 12.5,
            }}
          />
        </div>

        <div
          className="forkly-header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <IconButton
            theme={theme}
            label="Toggle theme"
            onClick={() =>
              setMode(
                mode === "dark"
                  ? "light"
                  : "dark"
              )
            }
            icon={
              mode === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )
            }
          />

          <div
            className={`forkly-bell-wrap ${
              celebrateDelivery
                ? "forkly-bell-celebrate"
                : ""
            }`}
          >
            <IconButton
              theme={theme}
              label="Notifications"
              onClick={
                onOpenNotifications
              }
              badge={unreadCount || null}
              icon={<Bell size={18} />}
            />
          </div>

          <IconButton
            theme={theme}
            label="Favorites"
            onClick={() =>
              navigate("favorites")
            }
            badge={favCount || null}
            icon={
              <Heart
                size={18}
                fill={
                  view === "favorites"
                    ? theme.primary
                    : "none"
                }
                color={
                  view === "favorites"
                    ? theme.primary
                    : theme.text
                }
              />
            }
          />

          <IconButton
            theme={theme}
            label="Cart"
            onClick={onOpenCart}
            badge={cartCount || null}
            icon={
              <ShoppingBag size={18} />
            }
          />

          {isAuthed ? (
            <button
              type="button"
              className="forkly-customer-profile"
              onClick={() =>
                navigate("profile")
              }
              aria-label="Profile"
              style={{
                minHeight: 42,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "4px 10px 4px 4px",
                color: theme.text,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: FONT_STACK,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  borderRadius: "50%",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {(user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span
                className="forkly-profile-name"
                style={{
                  maxWidth: 76,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                {user?.name?.split(" ")[0] ||
                  "Profile"}
              </span>
            </button>
          ) : (
            <PrimaryButton
              theme={theme}
              size="sm"
              onClick={onOpenAuth}
            >
              Sign in
            </PrimaryButton>
          )}

          <button
            type="button"
            className="forkly-mobile-menu-btn"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            style={{
              display: "none",
              color: theme.text,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              cursor: "pointer",
            }}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="forkly-mobile-panel"
          style={{
            padding: "4px 14px 16px",
            background:
              mode === "dark"
                ? "rgba(11,15,25,0.98)"
                : "rgba(255,253,249,0.98)",
            borderTop: `1px solid ${theme.border}`,
            boxShadow: theme.shadowSoft,
          }}
        >
          <div
            className="forkly-mobile-panel-inner"
            style={{
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 14px",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 13,
              }}
            >
              <Search
                size={17}
                color={theme.textMuted}
              />

              <input
                value={localQuery}
                onChange={(event) =>
                  setLocalQuery(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    submitSearch();
                  }
                }}
                placeholder="Search food or restaurants"
                style={{
                  width: "100%",
                  color: theme.text,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: FONT_STACK,
                  fontSize: 14,
                }}
              />

              <button
                type="button"
                onClick={submitSearch}
                style={{
                  padding: "7px 12px",
                  color: "#ffffff",
                  background: theme.primary,
                  border: "none",
                  borderRadius: 9,
                  cursor: "pointer",
                  fontSize: 11.5,
                  fontWeight: 750,
                }}
              >
                Search
              </button>
            </div>

            <nav
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    navigate(item.id);
                    setMobileOpen(false);
                  }}
                  style={{
                    padding: "11px 12px",
                    color:
                      view === item.id
                        ? theme.primary
                        : theme.text,
                    background:
                      view === item.id
                        ? theme.primarySoft
                        : theme.card,
                    border: `1px solid ${
                      view === item.id
                        ? theme.primary
                        : theme.border
                    }`,
                    borderRadius: 11,
                    cursor: "pointer",
                    fontSize: 12.5,
                    fontWeight: 750,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div
              className="forkly-mobile-quick-actions"
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              <MobileHeaderAction
                theme={theme}
                label={
                  mode === "dark"
                    ? "Light"
                    : "Dark"
                }
                icon={
                  mode === "dark" ? (
                    <Sun size={17} />
                  ) : (
                    <Moon size={17} />
                  )
                }
                onClick={() =>
                  setMode(
                    mode === "dark"
                      ? "light"
                      : "dark"
                  )
                }
              />

              <MobileHeaderAction
                theme={theme}
                label="Alerts"
                badge={unreadCount}
                icon={<Bell size={17} />}
                onClick={() => {
                  onOpenNotifications();
                  setMobileOpen(false);
                }}
              />

              <MobileHeaderAction
                theme={theme}
                label="Saved"
                badge={favCount}
                icon={<Heart size={17} />}
                onClick={() => {
                  navigate("favorites");
                  setMobileOpen(false);
                }}
              />

              <MobileHeaderAction
                theme={theme}
                label="Cart"
                badge={cartCount}
                icon={
                  <ShoppingBag size={17} />
                }
                onClick={() => {
                  onOpenCart();
                  setMobileOpen(false);
                }}
              />
            </div>

            {!isAuthed && (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth();
                  setMobileOpen(false);
                }}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "12px 16px",
                  color: "#ffffff",
                  background: theme.primary,
                  border: "none",
                  borderRadius: 11,
                  cursor: "pointer",
                  fontWeight: 750,
                }}
              >
                Sign in or create account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileHeaderAction({
  theme,
  label,
  icon,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        minWidth: 0,
        padding: "10px 5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        color: theme.text,
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 11,
        cursor: "pointer",
        fontSize: 10.5,
        fontWeight: 700,
      }}
    >
      {icon}
      {label}

      {badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 8,
            minWidth: 15,
            height: 15,
            padding: "0 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            background: theme.primary,
            borderRadius: 999,
            fontSize: 8.5,
            fontWeight: 800,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileBottomNav({ theme, view, navigate, cartCount, onOpenCart }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "restaurants", label: "Search", icon: Search },
    { id: "cart", label: "Cart", icon: ShoppingBag, isCart: true },
    { id: "orders", label: "Orders", icon: Package },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <nav className="forkly-bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 45, display: "none",
      background: theme.card, borderTop: `1px solid ${theme.border}`,
      padding: "10px 6px calc(10px + env(safe-area-inset-bottom))",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button key={it.id}
              onClick={() => (it.isCart ? onOpenCart() : navigate(it.id))}
              style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? theme.primary : theme.textMuted, cursor: "pointer", position: "relative", padding: "4px 10px", fontFamily: FONT_STACK }}
            >
              <Icon size={21} fill={active && !it.isCart ? theme.primarySoft : "none"} />
              {it.isCart && cartCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: 2, background: theme.primary, color: "#fff", fontSize: 9.5, fontWeight: 700, borderRadius: 999, minWidth: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
              <span style={{ fontSize: 10.5, fontWeight: 600 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Footer({
  theme,
  navigate,
}) {
  const exploreLinks = [
    {
      label: "Home",
      view: "home",
    },
    {
      label: "Restaurants",
      view: "restaurants",
    },
    {
      label: "Categories",
      view: "categories",
    },
    {
      label: "Offers",
      view: "offers",
    },
  ];

  const accountLinks = [
    {
      label: "My orders",
      view: "orders",
    },
    {
      label: "Saved restaurants",
      view: "favorites",
    },
    {
      label: "My profile",
      view: "profile",
    },
  ];

  return (
    <footer
      className="forkly-customer-footer"
      style={{
        marginTop: 54,
        color: theme.text,
        background: theme.bgAlt,
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          className="forkly-footer-cta"
          style={{
            position: "relative",
            top: -28,
            overflow: "hidden",
            padding: "27px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 22,
            color: "#ffffff",
            background:
              "linear-gradient(135deg, #ff6b35, #e94e22)",
            borderRadius: 22,
            boxShadow:
              "0 20px 45px rgba(220,75,30,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -65,
              top: -100,
              width: 230,
              height: 230,
              background:
                "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 850,
                letterSpacing: -0.4,
              }}
            >
              Ready to discover your next
              favourite meal?
            </div>

            <div
              style={{
                marginTop: 5,
                color:
                  "rgba(255,255,255,0.78)",
                fontSize: 12.5,
              }}
            >
              Explore local restaurants
              and get delicious food
              delivered.
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("restaurants")
            }
            style={{
              position: "relative",
              zIndex: 1,
              flexShrink: 0,
              padding: "11px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color: theme.primary,
              background: "#ffffff",
              border: "none",
              borderRadius: 11,
              boxShadow:
                "0 9px 20px rgba(100,30,10,0.14)",
              cursor: "pointer",
              fontFamily: FONT_STACK,
              fontSize: 12,
              fontWeight: 850,
            }}
          >
            Find food
            <ArrowRight size={15} />
          </button>
        </div>

        <div
          className="forkly-footer-grid"
          style={{
            padding: "13px 0 38px",
            display: "grid",
            gridTemplateColumns:
              "1.5fr 0.8fr 0.9fr 1.1fr",
            gap: 42,
          }}
        >
          <div>
            <Logo
              theme={theme}
              onClick={() =>
                navigate("home")
              }
            />

            <p
              style={{
                maxWidth: 310,
                margin: "16px 0 0",
                color: theme.textMuted,
                fontSize: 12.5,
                lineHeight: 1.7,
              }}
            >
              Forkly connects customers
              with great local restaurants
              through fast ordering, live
              tracking and reliable
              delivery.
            </p>

            <div
              style={{
                marginTop: 17,
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
              }}
            >
              <span
                style={{
                  padding: "6px 9px",
                  color: theme.success,
                  background:
                    theme.successSoft,
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 750,
                }}
              >
                Fast delivery
              </span>

              <span
                style={{
                  padding: "6px 9px",
                  color: theme.primary,
                  background:
                    theme.primarySoft,
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 750,
                }}
              >
                Secure payments
              </span>
            </div>
          </div>

          <FooterLinkColumn
            theme={theme}
            title="Explore"
            links={exploreLinks}
            navigate={navigate}
          />

          <FooterLinkColumn
            theme={theme}
            title="Your account"
            links={accountLinks}
            navigate={navigate}
          />

          <div>
            <div
              style={{
                marginBottom: 15,
                color: theme.text,
                fontSize: 12.5,
                fontWeight: 800,
              }}
            >
              Contact Forkly
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                color: theme.textMuted,
                fontSize: 11.5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Mail
                  size={15}
                  color={theme.primary}
                />
                support@forkly.com
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Phone
                  size={15}
                  color={theme.primary}
                />
                Customer support
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ShieldCheck
                  size={15}
                  color={theme.primary}
                />
                Safe and secure ordering
              </div>
            </div>
          </div>
        </div>

        <div
          className="forkly-footer-bottom"
          style={{
            padding: "18px 0 23px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 15,
            color: theme.textFaint,
            borderTop: `1px solid ${theme.border}`,
            fontSize: 10.5,
          }}
        >
          <span>
            © {new Date().getFullYear()}{" "}
            Forkly. All rights reserved.
          </span>

          <span>
            Made for better food
            experiences.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  theme,
  title,
  links,
  navigate,
}) {
  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          color: theme.text,
          fontSize: 12.5,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        {links.map((link) => (
          <button
            key={link.view}
            type="button"
            onClick={() =>
              navigate(link.view)
            }
            style={{
              padding: "5px 0",
              color: theme.textMuted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: FONT_STACK,
              fontSize: 11.5,
              transition:
                "color 0.2s ease, transform 0.2s ease",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   RESTAURANT CARD (shared: Home + Listing)
   ========================================================================= */
function CategoryIcon({
  id,
  size = 22,
  color,
}) {
  const icons = {
    burger: Sandwich,
    pizza: Pizza,
    salad: Salad,
    noodles: Soup,
    curry: CookingPot,
    sushi: Fish,
    taco: Flame,
    cake: CakeSlice,
  };

  const Icon =
    icons[id] || UtensilsCrossed;

  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={1.9}
    />
  );
}

function RestaurantCard({
  r,
  theme,
  onOpen,
  isFav,
  onToggleFav,
  compact,
}) {
  const openCard = () => {
    onOpen(r.id);
  };

  return (
    <article
      className={`forkly-restaurant-card ${
        compact
          ? "forkly-restaurant-card-compact"
          : ""
      }`}
      onClick={openCard}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openCard();
        }
      }}
      role="button"
      tabIndex={0}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: theme.text,
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 21,
        boxShadow: theme.shadowSoft,
        cursor: "pointer",
        transition:
          "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
      }}
    >
      <div
        className="forkly-restaurant-card-image"
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: compact
            ? "16 / 10"
            : "16 / 10.5",
        }}
      >
        <FoodImage
          src={r.image}
          alt={r.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,8,5,0.03) 45%, rgba(10,8,5,0.48) 100%)",
            pointerEvents: "none",
          }}
        />

        {r.offer && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #ff6b35, #ee4f22)",
              borderRadius: 999,
              boxShadow:
                "0 8px 18px rgba(0,0,0,0.18)",
              fontSize: 10.5,
              fontWeight: 800,
            }}
          >
            <Tag size={12} />
            {r.offer}
          </div>
        )}

        <button
          type="button"
          className="forkly-restaurant-heart"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFav(r.id);
          }}
          aria-label={
            isFav
              ? `Remove ${r.name} from favourites`
              : `Add ${r.name} to favourites`
          }
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            width: 37,
            height: 37,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isFav
              ? theme.primary
              : "#ffffff",
            background: isFav
              ? theme.card
              : "rgba(16,13,10,0.55)",
            backdropFilter: "blur(9px)",
            border: isFav
              ? `1px solid ${theme.border}`
              : "1px solid rgba(255,255,255,0.18)",
            borderRadius: "50%",
            boxShadow:
              "0 8px 18px rgba(0,0,0,0.16)",
            cursor: "pointer",
            transition:
              "transform 0.2s ease, background 0.2s ease",
          }}
        >
          <Heart
            size={17}
            fill={
              isFav
                ? theme.primary
                : "none"
            }
            strokeWidth={2.2}
          />
        </button>

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 11,
            padding: "6px 9px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#ffffff",
            background:
              "rgba(16,13,10,0.58)",
            backdropFilter: "blur(8px)",
            border:
              "1px solid rgba(255,255,255,0.14)",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 750,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: theme.success,
              borderRadius: "50%",
              boxShadow:
                "0 0 0 3px rgba(34,197,94,0.2)",
            }}
          />
          Open for delivery
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "16px 16px 15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent:
              "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <h3
              style={{
                margin: 0,
                overflow: "hidden",
                color: theme.text,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: -0.3,
              }}
            >
              {r.name}
            </h3>

            <div
              style={{
                marginTop: 4,
                overflow: "hidden",
                color: theme.textMuted,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 12.5,
              }}
            >
              {r.cuisine} · {r.priceLevel}
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color:
                r.rating > 0
                  ? "#166534"
                  : theme.textMuted,
              background:
                r.rating > 0
                  ? "rgba(34,197,94,0.12)"
                  : theme.bgAlt,
              borderRadius: 9,
              fontSize: 11.5,
              fontWeight: 800,
            }}
          >
            {r.rating > 0 ? (
              <>
                <Star
                  size={12}
                  fill="currentColor"
                />
                {r.rating.toFixed(1)}
              </>
            ) : (
              "New"
            )}
          </div>
        </div>

        {r.tagline && (
          <p
            className="forkly-restaurant-tagline"
            style={{
              margin: "10px 0 0",
              display: "-webkit-box",
              overflow: "hidden",
              color: theme.textFaint,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              fontSize: 11.5,
              lineHeight: 1.5,
            }}
          >
            {r.tagline}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "6px 9px",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: theme.textMuted,
              background: theme.bgAlt,
              borderRadius: 9,
              fontSize: 10.5,
              fontWeight: 650,
            }}
          >
            <Clock size={12} />
            {r.time}
          </span>

          <span
            style={{
              padding: "6px 9px",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: theme.textMuted,
              background: theme.bgAlt,
              borderRadius: 9,
              fontSize: 10.5,
              fontWeight: 650,
            }}
          >
            <MapPin size={12} />
            {r.distance}
          </span>
        </div>

        <div
          className="forkly-restaurant-card-footer"
          style={{
            marginTop: 13,
            paddingTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <span
            style={{
              color: theme.textFaint,
              fontSize: 10.5,
            }}
          >
            {r.reviewCount > 0
              ? `${r.reviewCount} customer reviews`
              : "Be the first to review"}
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: theme.primary,
              fontSize: 11.5,
              fontWeight: 800,
            }}
          >
            View menu
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}
/* =========================================================================
   HOME PAGE
   ========================================================================= */
function HomePage({
  theme,
  mode,
  navigate,
  openRestaurant,
  query,
  setQuery,
  favorites,
  toggleFavorite,
  restaurants,
}) {  const [heroQuery, setHeroQuery] = useState("");
  const popular = useMemo(
  () =>
    [...restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4),
  [restaurants]
);

const featuredOffer =
  restaurants.find((restaurant) => restaurant.offer) ||
  restaurants[0];

  const steps = [
    { n: "01", title: "Browse & choose", desc: "Explore restaurants near you and pick your favorite dishes.", icon: Search },
    { n: "02", title: "Order & pay", desc: "Checkout securely with your saved card or preferred method.", icon: CreditCard },
    { n: "03", title: "Track in real time", desc: "Watch your order move from the kitchen to your door.", icon: Truck },
  ];

  return (
    <div>
      {/* HERO */}
<section
  className="forkly-hero-section"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "32px 24px 12px",
  }}
>
  <div
    className="forkly-hero-shell"
    style={{
      position: "relative",
      overflow: "hidden",
      padding: "54px 50px",
      background:
        mode === "dark"
          ? "linear-gradient(135deg, #151a24 0%, #111722 56%, #25170f 100%)"
          : "linear-gradient(135deg, #fff4e8 0%, #fffdf9 55%, #ffead8 100%)",
      border: `1px solid ${theme.border}`,
      borderRadius: 34,
      boxShadow: theme.shadowSoft,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -110,
        right: -80,
        width: 310,
        height: 310,
        background:
          "rgba(255,107,53,0.12)",
        borderRadius: "50%",
        filter: "blur(4px)",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "absolute",
        bottom: -130,
        left: "35%",
        width: 270,
        height: 270,
        background:
          "rgba(255,200,87,0.12)",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />

    <div
      className="forkly-hero-grid"
      style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns:
          "1.05fr 0.95fr",
        gap: 54,
        alignItems: "center",
      }}
    >
      <div className="forkly-hero-copy">
        <div
          className="forkly-hero-eyebrow"
          style={{
            width: "fit-content",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 13px",
            color: theme.primary,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 999,
            boxShadow: theme.shadowSoft,
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          <Truck size={14} />
          Fast delivery · Best prices
        </div>

        <h1
          style={{
            maxWidth: 570,
            margin: "22px 0 0",
            color: theme.text,
            fontSize: 58,
            fontWeight: 850,
            lineHeight: 1.02,
            letterSpacing: -2.2,
          }}
        >
          Delicious food,
          <br />
          delivered{" "}
          <span
            style={{
              position: "relative",
              color: theme.primary,
            }}
          >
            fast.
          </span>
        </h1>

        <p
          style={{
            maxWidth: 510,
            margin: "20px 0 0",
            color: theme.textMuted,
            fontSize: 16,
            lineHeight: 1.7,
          }}
        >
          Discover local favourites, order in
          seconds and follow every step from the
          restaurant kitchen to your door.
        </p>

        <div
          className="forkly-hero-search"
          style={{
            maxWidth: 590,
            marginTop: 28,
            padding: 6,
            display: "flex",
            gap: 8,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            boxShadow: theme.shadow,
          }}
        >
          <div
            className="forkly-hero-search-field"
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 13px",
              borderRadius: 11,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.primary,
                background:
                  theme.primarySoft,
                borderRadius: 10,
              }}
            >
              <MapPin size={17} />
            </div>

            <input
              value={heroQuery}
              onChange={(event) =>
                setHeroQuery(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  setQuery(
                    heroQuery.trim()
                  );
                  setHeroQuery("");
                  navigate("restaurants");
                }
              }}
              placeholder="Search a dish or restaurant"
              style={{
                width: "100%",
                minWidth: 0,
                padding: "13px 0",
                color: theme.text,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: FONT_STACK,
                fontSize: 13.5,
              }}
            />
          </div>

          <PrimaryButton
            theme={theme}
            size="lg"
            onClick={() => {
              setQuery(heroQuery.trim());
              setHeroQuery("");
              navigate("restaurants");
            }}
          >
            <Search size={17} />
            Find food
          </PrimaryButton>
        </div>

        <div
          className="forkly-hero-promises"
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 17,
            flexWrap: "wrap",
            color: theme.textMuted,
            fontSize: 11.5,
            fontWeight: 650,
          }}
        >
          <span>
            <CheckCircle2
              size={15}
              color={theme.success}
            />
            Live order tracking
          </span>

          <span>
            <ShieldCheck
              size={15}
              color={theme.success}
            />
            Secure payments
          </span>

          <span>
            <CheckCircle2
              size={15}
              color={theme.success}
            />
            No hidden charges
          </span>
        </div>

        <div
          className="forkly-hero-community"
          style={{
            marginTop: 27,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {[
              IMG.avatar1,
              IMG.avatar2,
              IMG.avatar3,
              IMG.avatar4,
            ].map((avatar, index) => (
              <img
                key={avatar}
                src={avatar}
                alt=""
                style={{
                  width: 35,
                  height: 35,
                  objectFit: "cover",
                  border: `2px solid ${theme.card}`,
                  borderRadius: "50%",
                  marginLeft:
                    index === 0 ? 0 : -10,
                }}
              />
            ))}
          </div>

          <div>
            <div
              style={{
                color: theme.text,
                fontSize: 12.5,
                fontWeight: 650,
              }}
            >
              Join{" "}
              <strong>10,000+</strong>{" "}
              happy customers
            </div>

            <div
              style={{
                marginTop: 3,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: theme.textMuted,
                fontSize: 11.5,
              }}
            >
              <StarRating
                rating={4.8}
                size={12}
              />
              4.8 average rating
            </div>
          </div>
        </div>
      </div>

      <div
        className="forkly-hero-image"
        style={{
          position: "relative",
        }}
      >
        <div
          className="forkly-hero-photo"
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "1 / 0.91",
            border: `6px solid ${theme.card}`,
            borderRadius: 28,
            boxShadow: theme.shadow,
          }}
        >
          <FoodImage
            src={IMG.heroFood}
            alt="Fresh restaurant food"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 55%, rgba(16,9,5,0.2))",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          className="forkly-hero-delivery-card"
          style={{
            position: "absolute",
            top: 22,
            left: -20,
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: theme.text,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 15,
            boxShadow: theme.shadow,
          }}
        >
          <div
            style={{
              width: 37,
              height: 37,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.primary,
              background: theme.primarySoft,
              borderRadius: 11,
            }}
          >
            <Clock size={18} />
          </div>

          <div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 800,
              }}
            >
              25 mins
            </div>

            <div
              style={{
                marginTop: 2,
                color: theme.textMuted,
                fontSize: 10.5,
              }}
            >
              Average delivery
            </div>
          </div>
        </div>

        <div
          className="forkly-hero-rating-card"
          style={{
            position: "absolute",
            right: -18,
            bottom: 26,
            padding: "12px 15px",
            color: theme.text,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 15,
            boxShadow: theme.shadow,
          }}
        >
          <StarRating
            rating={4.7}
            size={14}
          />

          <div
            style={{
              marginTop: 4,
              color: theme.textMuted,
              fontSize: 10.5,
            }}
          >
            Loved by foodies
          </div>
        </div>

        <div
          className="forkly-hero-live-card"
          style={{
            position: "absolute",
            left: 18,
            bottom: 18,
            padding: "8px 11px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: "#ffffff",
            background:
              "rgba(20,23,31,0.72)",
            backdropFilter: "blur(10px)",
            border:
              "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: "#22c55e",
              borderRadius: "50%",
              boxShadow:
                "0 0 0 4px rgba(34,197,94,0.2)",
            }}
          />
          Live delivery tracking
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CATEGORIES */}
<section
  className="forkly-home-categories-section"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "42px 24px 10px",
  }}
>
  <SectionHeading
    theme={theme}
    eyebrow="Browse by cuisine"
    title="What are you craving?"
    action={{
      label: "View all categories",
      onClick: () =>
        navigate("categories"),
    }}
  />

  <div
    className="forkly-home-category-list forkly-scrollx"
    style={{
      display: "flex",
      gap: 12,
      overflowX: "auto",
      padding: "3px 2px 12px",
    }}
  >
    {CATEGORIES.map((category) => (
      <button
        key={category.id}
        type="button"
        className="forkly-home-category-card"
        onClick={() => {
          setQuery("");
          navigate("restaurants", {
            category: category.id,
          });
        }}
        style={{
          minWidth: 136,
          flex: "1 0 136px",
          padding: "13px 11px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: theme.text,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 19,
          boxShadow: theme.shadowSoft,
          cursor: "pointer",
          fontFamily: FONT_STACK,
          transition:
            "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        }}
      >
        <div
          className="forkly-category-photo"
          style={{
            position: "relative",
            width: 76,
            height: 76,
            marginBottom: 12,
          }}
        >
          <FoodImage
            src={category.image}
            alt={category.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 20,
            }}
          />

          <div
            style={{
              position: "absolute",
              right: -5,
              bottom: -5,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: category.color,
              background: theme.card,
              border: `2px solid ${theme.card}`,
              borderRadius: 10,
              boxShadow: theme.shadowSoft,
            }}
          >
            <CategoryIcon
              id={category.icon}
              size={16}
              color={category.color}
            />
          </div>
        </div>

        <span
          style={{
            color: theme.text,
            fontSize: 13,
            fontWeight: 750,
            textAlign: "center",
          }}
        >
          {category.name}
        </span>

        <span
          className="forkly-category-explore-text"
          style={{
            marginTop: 5,
            color: theme.textFaint,
            fontSize: 10.5,
            fontWeight: 600,
          }}
        >
          Explore food
        </span>
      </button>
    ))}
  </div>
</section>
      {/* POPULAR RESTAURANTS */}
<section
  className="forkly-home-popular-section"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "46px 24px 10px",
  }}
>
  <SectionHeading
    theme={theme}
    eyebrow="Popular near you"
    title="Restaurants customers love"
    action={{
      label: "View all restaurants",
      onClick: () =>
        navigate("restaurants"),
    }}
  />

  {popular.length === 0 ? (
    <div
      style={{
        padding: "45px 20px",
        color: theme.textMuted,
        textAlign: "center",
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
      }}
    >
      Popular restaurants will appear
      here.
    </div>
  ) : (
    <div
      className="forkly-home-popular-grid"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(4, minmax(0, 1fr))",
        gap: 17,
      }}
    >
      {popular.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          r={restaurant}
          theme={theme}
          onOpen={openRestaurant}
          isFav={favorites.has(
            restaurant.id
          )}
          onToggleFav={toggleFavorite}
          compact
        />
      ))}
    </div>
  )}

  {featuredOffer && (
    <div
      className="forkly-home-offer-banner"
      onClick={() =>
        openRestaurant(
          featuredOffer.id
        )
      }
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 280,
        marginTop: 45,
        display: "grid",
        gridTemplateColumns:
          "1.05fr 0.95fr",
        alignItems: "stretch",
        color: "#ffffff",
        background:
          "linear-gradient(135deg, #ff6b35 0%, #e95025 58%, #be3517 100%)",
        borderRadius: 28,
        boxShadow:
          "0 24px 55px rgba(220,75,30,0.2)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -130,
          left: "32%",
          width: 300,
          height: 300,
          background:
            "rgba(255,255,255,0.09)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        className="forkly-home-offer-copy"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "40px 42px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "fit-content",
            padding: "7px 11px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background:
              "rgba(255,255,255,0.16)",
            border:
              "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 850,
            letterSpacing: 0.5,
          }}
        >
          <Tag size={13} />
          LIMITED-TIME OFFER
        </div>

        <h2
          style={{
            maxWidth: 500,
            margin: "18px 0 0",
            fontSize: 36,
            lineHeight: 1.08,
            letterSpacing: -1.1,
          }}
        >
          Save more on your next meal
          from {featuredOffer.name}
        </h2>

        <p
          style={{
            maxWidth: 480,
            margin: "13px 0 0",
            color:
              "rgba(255,255,255,0.8)",
            fontSize: 13.5,
            lineHeight: 1.65,
          }}
        >
          {featuredOffer.offer ||
            "Enjoy 20% off your first order and discover your new favourite meal."}
        </p>

        <div
          style={{
            width: "fit-content",
            marginTop: 22,
            padding: "11px 16px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: theme.primary,
            background: "#ffffff",
            borderRadius: 11,
            boxShadow:
              "0 10px 24px rgba(93,31,10,0.17)",
            fontSize: 12,
            fontWeight: 850,
          }}
        >
          Order from this restaurant
          <ArrowRight size={15} />
        </div>
      </div>

      <div
        className="forkly-home-offer-image"
        style={{
          position: "relative",
          minHeight: 280,
          overflow: "hidden",
        }}
      >
        <FoodImage
          src={featuredOffer.image}
          alt={featuredOffer.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(217,69,24,0.85) 0%, rgba(217,69,24,0.08) 48%, transparent 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,
            padding: "10px 13px",
            color: theme.text,
            background: theme.card,
            borderRadius: 13,
            boxShadow: theme.shadow,
          }}
        >
          <StarRating
            rating={
              featuredOffer.rating
            }
            size={13}
          />

          <div
            style={{
              marginTop: 3,
              color: theme.textMuted,
              fontSize: 10,
            }}
          >
            Customer favourite
          </div>
        </div>
      </div>
    </div>
  )}

  <div
    className="forkly-testimonials-section"
    style={{
      marginTop: 50,
    }}
  >
    <SectionHeading
      theme={theme}
      eyebrow="Customer stories"
      title="Why people choose Forkly"
    />

    <div
      className="forkly-testimonials-grid"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(3, minmax(0, 1fr))",
        gap: 17,
      }}
    >
      {TESTIMONIALS.map(
        (testimonial, index) => (
          <article
            key={testimonial.name}
            className="forkly-testimonial-card"
            style={{
              position: "relative",
              overflow: "hidden",
              padding: 21,
              color: theme.text,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 19,
              boxShadow: theme.shadowSoft,
              transition:
                "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -16,
                right: 13,
                color:
                  index === 0
                    ? "rgba(255,107,53,0.1)"
                    : index === 1
                      ? "rgba(139,92,246,0.1)"
                      : "rgba(34,197,94,0.1)",
                fontFamily: "Georgia, serif",
                fontSize: 88,
                fontWeight: 900,
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              “
            </div>

            <StarRating
              rating={
                testimonial.rating
              }
              size={12}
            />

            <p
              style={{
                position: "relative",
                zIndex: 1,
                minHeight: 63,
                margin: "13px 0 17px",
                color: theme.textMuted,
                fontSize: 12.5,
                lineHeight: 1.65,
              }}
            >
              “{testimonial.text}”
            </p>

            <div
              style={{
                paddingTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderTop: `1px solid ${theme.border}`,
              }}
            >
              <img
                src={
                  testimonial.avatar
                }
                alt={
                  testimonial.name
                }
                style={{
                  width: 37,
                  height: 37,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />

              <div>
                <div
                  style={{
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {testimonial.name}
                </div>

                <div
                  style={{
                    marginTop: 2,
                    color: theme.textFaint,
                    fontSize: 9.5,
                  }}
                >
                  Verified Forkly customer
                </div>
              </div>
            </div>
          </article>
        )
      )}
    </div>
  </div>
</section>
      {/* HOW FORKLY WORKS */}
<section
  className="forkly-how-section"
  style={{
    maxWidth: 1280,
    margin: "0 auto",
    padding: "54px 24px 30px",
  }}
>
  <div
    className="forkly-how-shell"
    style={{
      position: "relative",
      overflow: "hidden",
      padding: "44px",
      background:
        theme.mode === "dark"
          ? "linear-gradient(135deg, #151a24, #10151f)"
          : "linear-gradient(135deg, #fffaf5, #ffffff)",
      border: `1px solid ${theme.border}`,
      borderRadius: 27,
      boxShadow: theme.shadowSoft,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -100,
        right: -90,
        width: 260,
        height: 260,
        background:
          theme.primarySoft,
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 590,
        margin: "0 auto 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: theme.primary,
          fontSize: 11,
          fontWeight: 850,
          letterSpacing: 0.9,
          textTransform: "uppercase",
        }}
      >
        Simple and convenient
      </div>

      <h2
        style={{
          margin: "8px 0 0",
          color: theme.text,
          fontSize: 32,
          letterSpacing: -0.9,
        }}
      >
        Your favourite food in three
        simple steps
      </h2>

      <p
        style={{
          margin: "11px 0 0",
          color: theme.textMuted,
          fontSize: 13.5,
          lineHeight: 1.65,
        }}
      >
        From discovering a restaurant to
        receiving your order, Forkly keeps
        everything simple and transparent.
      </p>
    </div>

    <div
      className="forkly-how-grid"
      style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns:
          "repeat(3, minmax(0, 1fr))",
        gap: 18,
      }}
    >
      {steps.map((step, index) => {
        const StepIcon = step.icon;

        return (
          <article
            key={step.n}
            className="forkly-how-card"
            style={{
              position: "relative",
              padding: 23,
              color: theme.text,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 19,
              boxShadow: theme.shadowSoft,
              transition:
                "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    index === 0
                      ? "#FF6B35"
                      : index === 1
                        ? "#8B5CF6"
                        : "#16A34A",
                  background:
                    index === 0
                      ? "rgba(255,107,53,0.12)"
                      : index === 1
                        ? "rgba(139,92,246,0.12)"
                        : "rgba(34,197,94,0.12)",
                  borderRadius: 14,
                }}
              >
                <StepIcon size={21} />
              </div>

              <span
                style={{
                  color: theme.borderStrong,
                  fontSize: 31,
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {step.n}
              </span>
            </div>

            <h3
              style={{
                margin: "18px 0 0",
                color: theme.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                margin: "8px 0 0",
                color: theme.textMuted,
                fontSize: 12.5,
                lineHeight: 1.65,
              }}
            >
              {step.desc}
            </p>

            <div
              style={{
                marginTop: 17,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: theme.success,
                fontSize: 10.5,
                fontWeight: 750,
              }}
            >
              <CheckCircle2 size={14} />
              Quick and effortless
            </div>
          </article>
        );
      })}
    </div>
  </div>
</section>
    </div>
  );
}

/* =========================================================================
   RESTAURANTS LISTING PAGE
   ========================================================================= */
function FilterPanel({
  theme,
  filters,
  setFilters,
  onReset,
  restaurants = [],
}) {
  const cuisines = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants
            .map(
              (restaurant) =>
                restaurant.cuisine
            )
            .filter(Boolean)
        )
      ),
    [restaurants]
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Filters</span>
        <button onClick={onReset} style={{ background: "none", border: "none", color: theme.primary, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT_STACK }}>Reset all</button>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>Diet</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ id: "all", label: "All" }, { id: "veg", label: "Veg" }, { id: "nonveg", label: "Non-veg" }].map((o) => (
            <Chip key={o.id} theme={theme} small active={filters.diet === o.id} onClick={() => setFilters((f) => ({ ...f, diet: o.id }))}>{o.label}</Chip>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>Rating</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ id: 0, label: "Any" }, { id: 4, label: "4.0+" }, { id: 4.5, label: "4.5+" }].map((o) => (
            <Chip key={o.id} theme={theme} small active={filters.rating === o.id} onClick={() => setFilters((f) => ({ ...f, rating: o.id }))}>{o.label}</Chip>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>Price</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Any", "$", "$$", "$$$"].map((o) => (
            <Chip key={o} theme={theme} small active={filters.price === o} onClick={() => setFilters((f) => ({ ...f, price: o }))}>{o}</Chip>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>Delivery time</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ id: 0, label: "Any" }, { id: 20, label: "Under 20 min" }, { id: 30, label: "Under 30 min" }].map((o) => (
            <Chip key={o.id} theme={theme} small active={filters.time === o.id} onClick={() => setFilters((f) => ({ ...f, time: o.id }))}>{o.label}</Chip>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>Cuisine</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip theme={theme} small active={filters.cuisine === "all"} onClick={() => setFilters((f) => ({ ...f, cuisine: "all" }))}>All</Chip>
          {cuisines.map((c) => (
            <Chip key={c} theme={theme} small active={filters.cuisine === c} onClick={() => setFilters((f) => ({ ...f, cuisine: c }))}>{c}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FILTERS = { diet: "all", rating: 0, price: "Any", time: 0, cuisine: "all", category: "all", sort: "rating" };

function OffersPage({
  theme,
  coupons,
  loading,
  error,
  navigate,
  openRestaurant,
}) {
  const [
    copiedCode,
    setCopiedCode,
  ] = useState("");

  const offerColors = [
    "#FF6B35",
    "#8B5CF6",
    "#16A34A",
    "#E11D48",
  ];

  const copyCouponCode =
    async (code) => {
      try {
        await navigator.clipboard.writeText(
          code
        );

        setCopiedCode(code);

        window.setTimeout(() => {
          setCopiedCode((current) =>
            current === code
              ? ""
              : current
          );
        }, 2000);
      } catch {
        setCopiedCode("");
      }
    };

  const formatDiscount = (coupon) => {
    if (
      coupon.discountType ===
      "PERCENTAGE"
    ) {
      return `${coupon.value}% OFF`;
    }

    return `₹${coupon.value.toLocaleString(
      "en-IN"
    )} OFF`;
  };

  const formatExpiry = (date) => {
    if (!date) {
      return "No expiry date";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main
      className="forkly-offers-page"
      style={{
        minHeight:
          "calc(100vh - 72px)",
        padding: "34px 24px 72px",
      }}
    >
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          className="forkly-offers-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "46px 48px",
            display: "grid",
            gridTemplateColumns:
              "1.1fr 0.9fr",
            gap: 38,
            alignItems: "center",
            color: "#ffffff",
            background:
              "linear-gradient(135deg, #ff6b35 0%, #f05225 52%, #ca3c18 100%)",
            borderRadius: 30,
            boxShadow:
              "0 25px 60px rgba(225,75,29,0.24)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -130,
              right: -40,
              width: 330,
              height: 330,
              background:
                "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: -150,
              left: "38%",
              width: 290,
              height: 290,
              background:
                "rgba(255,200,87,0.16)",
              borderRadius: "50%",
            }}
          />

          <div
            className="forkly-offers-hero-copy"
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "fit-content",
                padding: "7px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background:
                  "rgba(255,255,255,0.16)",
                border:
                  "1px solid rgba(255,255,255,0.22)",
                borderRadius: 999,
                backdropFilter:
                  "blur(10px)",
                fontSize: 11.5,
                fontWeight: 800,
              }}
            >
              <Sparkles size={14} />
              Exclusive Forkly savings
            </div>

            <h1
              style={{
                maxWidth: 590,
                margin: "20px 0 0",
                fontSize: 46,
                lineHeight: 1.05,
                letterSpacing: -1.7,
              }}
            >
              More flavour.
              <br />
              Less on your bill.
            </h1>

            <p
              style={{
                maxWidth: 560,
                margin: "17px 0 0",
                color:
                  "rgba(255,255,255,0.82)",
                fontSize: 14.5,
                lineHeight: 1.7,
              }}
            >
              Discover verified restaurant
              discounts, copy your offer code
              and apply it during checkout.
            </p>

            <div
              className="forkly-offer-benefits"
              style={{
                marginTop: 23,
                display: "flex",
                gap: 17,
                flexWrap: "wrap",
                color:
                  "rgba(255,255,255,0.9)",
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              <span>
                <CheckCircle2 size={15} />
                Verified offers
              </span>

              <span>
                <ShieldCheck size={15} />
                Secure checkout
              </span>

              <span>
                <Tag size={15} />
                Easy to apply
              </span>
            </div>
          </div>

          <div
            className="forkly-offers-hero-card"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 330,
              marginLeft: "auto",
              padding: "26px",
              color: theme.text,
              background: theme.card,
              border:
                "1px solid rgba(255,255,255,0.2)",
              borderRadius: 23,
              boxShadow:
                "0 22px 50px rgba(93,31,10,0.24)",
              transform: "rotate(2deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: 15,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.primary,
                  background:
                    theme.primarySoft,
                  borderRadius: 16,
                }}
              >
                <Percent size={25} />
              </div>

              <div
                style={{
                  padding: "6px 10px",
                  color: theme.success,
                  background:
                    theme.successSoft,
                  borderRadius: 999,
                  fontSize: 10.5,
                  fontWeight: 800,
                }}
              >
                LIVE DEALS
              </div>
            </div>

            <div
              style={{
                marginTop: 23,
                color: theme.text,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Available right now
            </div>

            <div
              style={{
                marginTop: 5,
                color: theme.primary,
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {loading
                ? "..."
                : coupons.length}
            </div>

            <div
              style={{
                marginTop: 7,
                color: theme.textMuted,
                fontSize: 11.5,
                lineHeight: 1.5,
              }}
            >
              Active offers ready to use
              on your next eligible order.
            </div>

            <div
              style={{
                marginTop: 20,
                paddingTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 7,
                color: theme.textMuted,
                borderTop: `1px dashed ${theme.borderStrong}`,
                fontSize: 10.5,
                fontWeight: 650,
              }}
            >
              <Clock size={14} />
              Limited-time savings
            </div>
          </div>
        </div>

        <div
          className="forkly-offers-section-heading"
          style={{
            margin: "38px 0 18px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent:
              "space-between",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                color: theme.primary,
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              Available now
            </div>

            <h2
              style={{
                margin: "7px 0 0",
                color: theme.text,
                fontSize: 27,
                letterSpacing: -0.7,
              }}
            >
              Choose your best deal
            </h2>
          </div>

          {!loading &&
            !error &&
            coupons.length > 0 && (
              <div
                style={{
                  padding: "7px 11px",
                  color: theme.primary,
                  background:
                    theme.primarySoft,
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                {coupons.length} active{" "}
                {coupons.length === 1
                  ? "offer"
                  : "offers"}
              </div>
            )}
        </div>

        {loading ? (
          <div
            className="forkly-offers-status-card"
            style={{
              padding: "55px 24px",
              color: theme.textMuted,
              textAlign: "center",
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
            }}
          >
            <Loader2
              size={30}
              className="forkly-spin"
              color={theme.primary}
            />

            <div
              style={{
                marginTop: 13,
                color: theme.text,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              Finding the best offers
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 12,
              }}
            >
              Loading available restaurant
              deals...
            </div>
          </div>
        ) : error ? (
          <div
            className="forkly-offers-status-card"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                margin: "0 auto 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.error,
                background: theme.errorSoft,
                borderRadius: 17,
              }}
            >
              <RotateCcw size={25} />
            </div>

            <div
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              Offers could not be loaded
            </div>

            <div
              style={{
                maxWidth: 460,
                margin: "7px auto 0",
                color: theme.textMuted,
                fontSize: 12.5,
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          </div>
        ) : coupons.length === 0 ? (
          <div
            className="forkly-offers-status-card"
            style={{
              padding: "52px 24px",
              textAlign: "center",
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.primary,
                background:
                  theme.primarySoft,
                borderRadius: 18,
              }}
            >
              <Tag size={27} />
            </div>

            <div
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              New offers are coming soon
            </div>

            <p
              style={{
                maxWidth: 430,
                margin: "8px auto 18px",
                color: theme.textMuted,
                fontSize: 12.5,
                lineHeight: 1.6,
              }}
            >
              Explore restaurants while we
              prepare more savings for you.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("restaurants")
              }
              style={{
                padding: "11px 17px",
                color: "#ffffff",
                background: theme.primary,
                border: "none",
                borderRadius: 11,
                cursor: "pointer",
                fontFamily: FONT_STACK,
                fontSize: 12.5,
                fontWeight: 800,
              }}
            >
              Browse restaurants
            </button>
          </div>
        ) : (
          <div
            className="forkly-offers-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            {coupons.map(
              (coupon, index) => {
                const accent =
                  offerColors[
                    index %
                      offerColors.length
                  ];

                return (
                  <article
                    key={coupon.id}
                    className="forkly-offer-card"
                    style={{
                      position: "relative",
                      minWidth: 0,
                      overflow: "hidden",
                      padding: 0,
                      display: "flex",
                      flexDirection:
                        "column",
                      color: theme.text,
                      background: theme.card,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 22,
                      boxShadow:
                        theme.shadowSoft,
                      transition:
                        "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
                    }}
                  >
                    <div
                      style={{
                        height: 6,
                        background: accent,
                      }}
                    />

                    <div
                      className="forkly-offer-card-body"
                      style={{
                        flex: 1,
                        padding: 22,
                        display: "flex",
                        flexDirection:
                          "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap: 13,
                        }}
                      >
                        <div
                          style={{
                            minWidth: 0,
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 11,
                          }}
                        >
                          {coupon.restaurant
                            ?.logoUrl ? (
                            <FoodImage
                              src={
                                coupon
                                  .restaurant
                                  .logoUrl
                              }
                              alt={
                                coupon
                                  .restaurant
                                  .name
                              }
                              style={{
                                width: 48,
                                height: 48,
                                flexShrink: 0,
                                objectFit:
                                  "cover",
                                borderRadius: 14,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 48,
                                height: 48,
                                flexShrink: 0,
                                display: "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                color: accent,
                                background: `${accent}18`,
                                borderRadius: 14,
                              }}
                            >
                              <Store
                                size={21}
                              />
                            </div>
                          )}

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                overflow:
                                  "hidden",
                                color:
                                  theme.text,
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                                fontSize: 13.5,
                                fontWeight: 800,
                              }}
                            >
                              {coupon
                                .restaurant
                                ?.name ||
                                "Forkly-wide offer"}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                color:
                                  theme.textMuted,
                                fontSize: 10.5,
                              }}
                            >
                              Valid until{" "}
                              {formatExpiry(
                                coupon.expiresAt
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            flexShrink: 0,
                            padding:
                              "6px 9px",
                            color: accent,
                            background: `${accent}14`,
                            borderRadius: 999,
                            fontSize: 9.5,
                            fontWeight: 850,
                          }}
                        >
                          ACTIVE
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 22,
                        }}
                      >
                        <div
                          style={{
                            color: accent,
                            fontSize: 31,
                            fontWeight: 900,
                            letterSpacing:
                              -0.9,
                          }}
                        >
                          {formatDiscount(
                            coupon
                          )}
                        </div>

                        <p
                          style={{
                            minHeight: 42,
                            margin:
                              "7px 0 0",
                            color:
                              theme.textMuted,
                            fontSize: 12.5,
                            lineHeight: 1.6,
                          }}
                        >
                          {coupon.description ||
                            "Save on your next eligible Forkly order."}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: 15,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 7,
                        }}
                      >
                        <span
                          style={{
                            padding:
                              "6px 9px",
                            color:
                              theme.textMuted,
                            background:
                              theme.bgAlt,
                            borderRadius: 999,
                            fontSize: 10.5,
                            fontWeight: 700,
                          }}
                        >
                          {coupon.minOrderValue ==
                          null
                            ? "No minimum order"
                            : `Minimum ₹${coupon.minOrderValue.toLocaleString(
                                "en-IN"
                              )}`}
                        </span>

                        {coupon.maxDiscount !=
                          null && (
                          <span
                            style={{
                              padding:
                                "6px 9px",
                              color:
                                theme.textMuted,
                              background:
                                theme.bgAlt,
                              borderRadius: 999,
                              fontSize: 10.5,
                              fontWeight: 700,
                            }}
                          >
                            Save up to ₹
                            {coupon.maxDiscount.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>

                      <div
                        className="forkly-offer-code-row"
                        style={{
                          marginTop: 20,
                          paddingTop: 17,
                          display: "flex",
                          alignItems:
                            "stretch",
                          gap: 9,
                          borderTop: `1px dashed ${theme.borderStrong}`,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding:
                              "11px 12px",
                            overflow:
                              "hidden",
                            color: accent,
                            background: `${accent}12`,
                            border: `1px dashed ${accent}`,
                            borderRadius: 11,
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                            fontSize: 13,
                            fontWeight: 900,
                            letterSpacing: 1,
                          }}
                        >
                          {coupon.code}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyCouponCode(
                              coupon.code
                            )
                          }
                          style={{
                            minWidth: 100,
                            padding:
                              "11px 15px",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap: 6,
                            color:
                              "#ffffff",
                            background:
                              copiedCode ===
                              coupon.code
                                ? theme.success
                                : accent,
                            border: "none",
                            borderRadius: 11,
                            cursor: "pointer",
                            fontFamily:
                              FONT_STACK,
                            fontSize: 11.5,
                            fontWeight: 800,
                          }}
                        >
                          {copiedCode ===
                          coupon.code ? (
                            <>
                              <Check
                                size={15}
                              />
                              Copied
                            </>
                          ) : (
                            <>
                              <Tag
                                size={14}
                              />
                              Copy code
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        className="forkly-offer-order-button"
                        onClick={() => {
                          if (
                            coupon.restaurant
                          ) {
                            openRestaurant(
                              coupon
                                .restaurant
                                .id
                            );
                          } else {
                            navigate(
                              "restaurants"
                            );
                          }
                        }}
                        style={{
                          width: "100%",
                          marginTop: 11,
                          padding:
                            "11px 14px",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          color: theme.text,
                          background:
                            "transparent",
                          border: `1px solid ${theme.border}`,
                          borderRadius: 11,
                          cursor: "pointer",
                          fontFamily:
                            FONT_STACK,
                          fontSize: 11.5,
                          fontWeight: 800,
                        }}
                      >
                        <span>
                          {coupon.restaurant
                            ? `Order from ${coupon.restaurant.name}`
                            : "Choose a restaurant"}
                        </span>

                        <ArrowRight
                          size={15}
                          color={accent}
                        />
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}



function CategoriesPage({
  theme,
  navigate,
  setQuery,
}) {
  const openCategory = (categoryId) => {
    setQuery("");

    navigate("restaurants", {
      category: categoryId,
    });
  };

  return (
    <main
      className="forkly-categories-page"
      style={{
        minHeight:
          "calc(100vh - 72px)",
        padding: "34px 24px 72px",
      }}
    >
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div
          className="forkly-categories-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "48px",
            display: "grid",
            gridTemplateColumns:
              "1.05fr 0.95fr",
            gap: 42,
            alignItems: "center",
            color:
              theme.mode === "dark"
                ? theme.text
                : "#24170f",
            background:
              theme.mode === "dark"
                ? "linear-gradient(135deg, #191b25, #24170f)"
                : "linear-gradient(135deg, #fff0e4, #fffaf5 52%, #ffe4cb)",
            border: `1px solid ${theme.border}`,
            borderRadius: 30,
            boxShadow: theme.shadowSoft,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -100,
              left: "42%",
              width: 280,
              height: 280,
              background:
                "rgba(255,107,53,0.12)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div
            className="forkly-categories-hero-copy"
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "fit-content",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 12px",
                color: theme.primary,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 999,
                boxShadow: theme.shadowSoft,
                fontSize: 11.5,
                fontWeight: 800,
              }}
            >
              <Sparkles size={14} />
              Explore every flavour
            </div>

            <h1
              style={{
                maxWidth: 570,
                margin: "20px 0 0",
                color: theme.text,
                fontSize: 46,
                lineHeight: 1.06,
                letterSpacing: -1.6,
              }}
            >
              What are you craving today?
            </h1>

            <p
              style={{
                maxWidth: 540,
                margin: "16px 0 0",
                color: theme.textMuted,
                fontSize: 14.5,
                lineHeight: 1.7,
              }}
            >
              From comforting Indian meals to
              fresh sushi and delicious desserts,
              find exactly what matches your mood.
            </p>

            <div
              className="forkly-categories-hero-actions"
              style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 11,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  navigate("restaurants");
                }}
                style={{
                  padding: "12px 18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#ffffff",
                  background: theme.primary,
                  border: "none",
                  borderRadius: 12,
                  boxShadow:
                    "0 12px 25px rgba(255,107,53,0.2)",
                  cursor: "pointer",
                  fontFamily: FONT_STACK,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                Browse all restaurants
                <ArrowRight size={16} />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: theme.textMuted,
                  fontSize: 12,
                  fontWeight: 650,
                }}
              >
                <CheckCircle2
                  size={16}
                  color={theme.success}
                />
                8 popular food categories
              </div>
            </div>
          </div>

          <div
            className="forkly-categories-hero-visual"
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: 290,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 38px 16px 0",
                overflow: "hidden",
                border: `5px solid ${theme.card}`,
                borderRadius: 24,
                boxShadow: theme.shadow,
              }}
            >
              <FoodImage
                src={IMG.curry}
                alt="Indian cuisine"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 142,
                height: 112,
                overflow: "hidden",
                border: `5px solid ${theme.card}`,
                borderRadius: 20,
                boxShadow: theme.shadow,
              }}
            >
              <FoodImage
                src={IMG.sushi}
                alt="Japanese cuisine"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: 19,
                left: -15,
                padding: "10px 13px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: theme.text,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 13,
                boxShadow: theme.shadow,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.primary,
                  background:
                    theme.primarySoft,
                  borderRadius: 10,
                }}
              >
                <Store size={17} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  Local favourites
                </div>

                <div
                  style={{
                    marginTop: 2,
                    color: theme.textMuted,
                    fontSize: 10,
                  }}
                >
                  Ready to deliver
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            margin: "38px 0 18px",
          }}
        >
          <div
            style={{
              color: theme.primary,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Browse cuisines
          </div>

          <h2
            style={{
              margin: "7px 0 0",
              color: theme.text,
              fontSize: 27,
              letterSpacing: -0.7,
            }}
          >
            Find food for every mood
          </h2>
        </div>

        <div
          className="forkly-categories-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className="forkly-category-page-card"
              onClick={() =>
                openCategory(category.id)
              }
              style={{
                minWidth: 0,
                overflow: "hidden",
                padding: 0,
                color: theme.text,
                textAlign: "left",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 21,
                boxShadow: theme.shadowSoft,
                cursor: "pointer",
                fontFamily: FONT_STACK,
                transition:
                  "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
              }}
            >
              <div
                className="forkly-category-card-image"
                style={{
                  position: "relative",
                  width: "100%",
                  height: 158,
                  overflow: "hidden",
                }}
              >
                <FoodImage
                  src={category.image}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(15,9,5,0.34))",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 13,
                    bottom: 12,
                    width: 39,
                    height: 39,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: category.color,
                    background: theme.card,
                    borderRadius: 12,
                    boxShadow: theme.shadowSoft,
                  }}
                >
                  <CategoryIcon
                    id={category.icon}
                    size={20}
                    color={category.color}
                  />
                </div>
              </div>

              <div
                className="forkly-category-card-content"
                style={{
                  padding: "17px 17px 18px",
                }}
              >
                <div
                  style={{
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {category.name}
                </div>

                <div
                  className="forkly-category-description"
                  style={{
                    minHeight: 40,
                    marginTop: 7,
                    color: theme.textMuted,
                    fontSize: 12.5,
                    lineHeight: 1.55,
                  }}
                >
                  {category.description}
                </div>

                <div
                  className="forkly-category-card-link"
                  style={{
                    marginTop: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: category.color,
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  View restaurants
                  <ArrowRight size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
function RestaurantsPage({
  theme,
  navigate,
  openRestaurant,
  query,
  setQuery,
  favorites,
  toggleFavorite,
  initialCategory,
  restaurants,
}) {
  const [filters, setFilters] =
    useState({
      ...DEFAULT_FILTERS,
      category:
        initialCategory || "all",
    });

  const [
    showMobileFilters,
    setShowMobileFilters,
  ] = useState(false);

  const [localQuery, setLocalQuery] =
    useState(query || "");

  useEffect(() => {
    setLocalQuery(query || "");
  }, [query]);

  useEffect(() => {
    if (initialCategory) {
      setFilters((current) => ({
        ...current,
        category: initialCategory,
      }));
    }
  }, [initialCategory]);

  const maxTimeOf = (restaurant) => {
    const times = String(
      restaurant.time || ""
    ).match(/\d+/g);

    return times?.length
      ? Math.max(...times.map(Number))
      : Infinity;
  };

  const results = useMemo(() => {
    let list = restaurants.filter(
      (restaurant) => {
        const searchText = (
          localQuery || ""
        )
          .trim()
          .toLowerCase();

        const matchesQuery =
          !searchText ||
          restaurant.name
            ?.toLowerCase()
            .includes(searchText) ||
          restaurant.cuisine
            ?.toLowerCase()
            .includes(searchText) ||
          restaurant.tagline
            ?.toLowerCase()
            .includes(searchText) ||
          restaurant.menu?.some(
            (category) =>
              category.items?.some(
                (item) =>
                  item.name
                    ?.toLowerCase()
                    .includes(
                      searchText
                    ) ||
                  item.desc
                    ?.toLowerCase()
                    .includes(
                      searchText
                    )
              )
          );

        const matchesDiet =
          filters.diet === "all" ||
          restaurant.veg ===
            filters.diet ||
          restaurant.veg === "both";

        const matchesRating =
          restaurant.rating >=
          filters.rating;

        const matchesPrice =
          filters.price === "Any" ||
          restaurant.priceLevel ===
            filters.price;

        const matchesTime =
          filters.time === 0 ||
          maxTimeOf(restaurant) <=
            filters.time;

        const matchesCuisine =
          filters.cuisine === "all" ||
          restaurant.cuisine ===
            filters.cuisine;

        const matchesCategory =
          filters.category === "all" ||
          restaurant.categoryIds?.includes(
            filters.category
          );

        return (
          matchesQuery &&
          matchesDiet &&
          matchesRating &&
          matchesPrice &&
          matchesTime &&
          matchesCuisine &&
          matchesCategory
        );
      }
    );

    if (filters.sort === "rating") {
      list = [...list].sort(
        (first, second) =>
          second.rating - first.rating
      );
    }

    if (filters.sort === "time") {
      list = [...list].sort(
        (first, second) =>
          maxTimeOf(first) -
          maxTimeOf(second)
      );
    }

    if (
      filters.sort === "priceAsc"
    ) {
      list = [...list].sort(
        (first, second) =>
          first.priceLevel.length -
          second.priceLevel.length
      );
    }

    return list;
  }, [
    localQuery,
    filters,
    restaurants,
  ]);

  const resetEverything = () => {
    setFilters({
      ...DEFAULT_FILTERS,
    });
    setLocalQuery("");
    setQuery("");
  };

  const activeCategory =
    CATEGORIES.find(
      (category) =>
        category.id ===
        filters.category
    );

  return (
    <main
      className="forkly-restaurants-page"
      style={{
        maxWidth: 1280,
        minHeight:
          "calc(100vh - 72px)",
        margin: "0 auto",
        padding: "30px 24px 70px",
      }}
    >
      <section
        className="forkly-restaurants-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "36px 38px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 28,
          background:
            theme.mode === "dark"
              ? "linear-gradient(135deg, #171b26, #25170f)"
              : "linear-gradient(135deg, #fff0e4, #fffaf5 58%, #ffe5ce)",
          border: `1px solid ${theme.border}`,
          borderRadius: 27,
          boxShadow: theme.shadowSoft,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: 120,
            width: 260,
            height: 260,
            background:
              "rgba(255,107,53,0.11)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("home")
            }
            style={{
              marginBottom: 13,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: theme.textMuted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={15} />
            Back to home
          </button>

          <div
            style={{
              color: theme.primary,
              fontSize: 11,
              fontWeight: 850,
              letterSpacing: 0.9,
              textTransform: "uppercase",
            }}
          >
            Discover great food
          </div>

          <h1
            style={{
              margin: "8px 0 0",
              color: theme.text,
              fontSize: 39,
              lineHeight: 1.08,
              letterSpacing: -1.2,
            }}
          >
            {activeCategory
              ? `${activeCategory.name} restaurants`
              : "Restaurants near you"}
          </h1>

          <p
            style={{
              maxWidth: 570,
              margin: "11px 0 0",
              color: theme.textMuted,
              fontSize: 13.5,
              lineHeight: 1.6,
            }}
          >
            Explore local restaurants,
            discover popular dishes and
            order your favourites in
            minutes.
          </p>
        </div>

        <div
          className="forkly-result-summary"
          style={{
            position: "relative",
            zIndex: 1,
            minWidth: 145,
            padding: "17px 19px",
            color: theme.text,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 17,
            boxShadow: theme.shadowSoft,
          }}
        >
          <div
            style={{
              color: theme.primary,
              fontSize: 29,
              fontWeight: 850,
              lineHeight: 1,
            }}
          >
            {results.length}
          </div>

          <div
            style={{
              marginTop: 6,
              color: theme.textMuted,
              fontSize: 11.5,
              fontWeight: 650,
            }}
          >
            {results.length === 1
              ? "restaurant found"
              : "restaurants found"}
          </div>
        </div>
      </section>

      <section
        className="forkly-restaurant-toolbar"
        style={{
          marginTop: 20,
          padding: 15,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          boxShadow: theme.shadowSoft,
        }}
      >
        <div
          className="forkly-restaurant-search-row"
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          <div
            className="forkly-restaurant-search-box"
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
            }}
          >
            <Search
              size={17}
              color={theme.primary}
            />

            <input
              value={localQuery}
              onChange={(event) => {
                setLocalQuery(
                  event.target.value
                );

                setQuery(
                  event.target.value
                );
              }}
              placeholder="Search restaurants, cuisines or dishes"
              style={{
                width: "100%",
                minWidth: 0,
                color: theme.text,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: FONT_STACK,
                fontSize: 13.5,
              }}
            />

            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery("");
                  setQuery("");
                }}
                aria-label="Clear search"
                style={{
                  padding: 3,
                  display: "flex",
                  color: theme.textMuted,
                  background:
                    "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                sort: event.target.value,
              }))
            }
            style={{
              minWidth: 155,
              padding: "0 13px",
              color: theme.text,
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              cursor: "pointer",
              fontFamily: FONT_STACK,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <option value="rating">
              Top rated
            </option>

            <option value="time">
              Fastest delivery
            </option>

            <option value="priceAsc">
              Price: low to high
            </option>
          </select>

          <button
            type="button"
            className="forkly-filters-btn"
            onClick={() =>
              setShowMobileFilters(true)
            }
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "0 15px",
              color: theme.text,
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              cursor: "pointer",
              fontFamily: FONT_STACK,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <SlidersHorizontal
              size={15}
            />
            Filters
          </button>
        </div>

        <div
          className="forkly-listing-categories forkly-scrollx"
          style={{
            marginTop: 12,
            paddingTop: 12,
            display: "flex",
            gap: 8,
            overflowX: "auto",
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <button
            type="button"
            className="forkly-listing-category-chip"
            onClick={() =>
              setFilters((current) => ({
                ...current,
                category: "all",
              }))
            }
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              color:
                filters.category === "all"
                  ? "#ffffff"
                  : theme.textMuted,
              background:
                filters.category === "all"
                  ? theme.primary
                  : theme.bg,
              border: `1px solid ${
                filters.category === "all"
                  ? theme.primary
                  : theme.border
              }`,
              borderRadius: 999,
              cursor: "pointer",
              fontSize: 11.5,
              fontWeight: 750,
            }}
          >
            All restaurants
          </button>

          {CATEGORIES.map(
            (category) => {
              const selected =
                filters.category ===
                category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  className="forkly-listing-category-chip"
                  onClick={() =>
                    setFilters(
                      (current) => ({
                        ...current,
                        category:
                          category.id,
                      })
                    )
                  }
                  style={{
                    flexShrink: 0,
                    padding: "7px 11px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: selected
                      ? "#ffffff"
                      : theme.textMuted,
                    background: selected
                      ? category.color
                      : theme.bg,
                    border: `1px solid ${
                      selected
                        ? category.color
                        : theme.border
                    }`,
                    borderRadius: 999,
                    cursor: "pointer",
                    fontSize: 11.5,
                    fontWeight: 750,
                  }}
                >
                  <CategoryIcon
                    id={category.icon}
                    size={14}
                    color={
                      selected
                        ? "#ffffff"
                        : category.color
                    }
                  />

                  {category.name}
                </button>
              );
            }
          )}
        </div>
      </section>

      <section
        className="forkly-listing-grid"
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns:
            "230px minmax(0, 1fr)",
          gap: 25,
          alignItems: "start",
        }}
      >
        <aside
          className="forkly-filters-sidebar"
          style={{
            position: "sticky",
            top: 94,
            padding: 19,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 18,
            boxShadow: theme.shadowSoft,
          }}
        >
          <FilterPanel
            theme={theme}
            filters={filters}
            setFilters={setFilters}
            onReset={resetEverything}
            restaurants={restaurants}
          />
        </aside>

        <div>
          <div
            className="forkly-results-heading"
            style={{
              marginBottom: 15,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: 14,
            }}
          >
            <div>
              <div
                style={{
                  color: theme.text,
                  fontSize: 17,
                  fontWeight: 800,
                }}
              >
                Available restaurants
              </div>

              <div
                style={{
                  marginTop: 3,
                  color: theme.textMuted,
                  fontSize: 11.5,
                }}
              >
                Showing {results.length}{" "}
                matching result
                {results.length === 1
                  ? ""
                  : "s"}
              </div>
            </div>

            {(localQuery ||
              filters.category !== "all" ||
              filters.diet !== "all" ||
              filters.rating !== 0 ||
              filters.price !== "Any" ||
              filters.time !== 0 ||
              filters.cuisine !==
                "all") && (
              <button
                type="button"
                onClick={resetEverything}
                style={{
                  color: theme.primary,
                  background:
                    "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div
              style={{
                padding: "68px 20px",
                color: theme.textMuted,
                textAlign: "center",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.primary,
                  background:
                    theme.primarySoft,
                  borderRadius: 18,
                }}
              >
                <Search size={28} />
              </div>

              <div
                style={{
                  color: theme.text,
                  fontSize: 17,
                  fontWeight: 800,
                }}
              >
                No matching restaurants
              </div>

              <p
                style={{
                  maxWidth: 390,
                  margin: "7px auto 17px",
                  fontSize: 12.5,
                  lineHeight: 1.6,
                }}
              >
                Try another search term or
                remove some filters to view
                more restaurants.
              </p>

              <button
                type="button"
                onClick={resetEverything}
                style={{
                  padding: "10px 15px",
                  color: "#ffffff",
                  background: theme.primary,
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 750,
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className="forkly-grid-3 forkly-restaurant-results-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: 18,
              }}
            >
              {results.map(
                (restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    r={restaurant}
                    theme={theme}
                    onOpen={
                      openRestaurant
                    }
                    isFav={favorites.has(
                      restaurant.id
                    )}
                    onToggleFav={
                      toggleFavorite
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {showMobileFilters && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={() =>
              setShowMobileFilters(false)
            }
            style={{
              position: "absolute",
              inset: 0,
              background: theme.overlay,
            }}
          />

          <div
            className="forkly-mobile-filter-sheet"
            style={{
              position: "relative",
              width: "100%",
              maxHeight: "84vh",
              overflowY: "auto",
              padding: 22,
              color: theme.text,
              background: theme.bg,
              borderRadius:
                "24px 24px 0 0",
              boxShadow: theme.shadow,
              animation:
                "forkly-slide-up .25s ease",
            }}
          >
            <div
              style={{
                width: 42,
                height: 4,
                margin: "0 auto 18px",
                background: theme.borderStrong,
                borderRadius: 999,
              }}
            />

            <FilterPanel
              theme={theme}
              filters={filters}
              setFilters={setFilters}
              onReset={resetEverything}
              restaurants={restaurants}
            />

            <PrimaryButton
              theme={theme}
              full
              onClick={() =>
                setShowMobileFilters(
                  false
                )
              }
            >
              Show {results.length} results
            </PrimaryButton>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================================
   ITEM CUSTOMIZE SHEET
   ========================================================================= */
function ItemSheet({ theme, item, restaurant, onClose, onConfirm }) {
  const [qty, setQty] = useState(1);
  const [addOns, setAddOns] = useState([]);

  const toggleAddOn = (ao) => {
    setAddOns((prev) => (prev.find((a) => a.name === ao.name) ? prev.filter((a) => a.name !== ao.name) : [...prev, ao]));
  };
  const addOnsTotal = addOns.reduce((s, a) => s + a.price, 0);
  const total = (item.price + addOnsTotal) * qty;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div className="forkly-item-sheet" style={{
        position: "relative", background: theme.bg, width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto",
        borderRadius: "24px 24px 0 0", boxShadow: theme.shadow, animation: "forkly-slide-up .25s ease",
      }}>
        <div style={{ position: "relative", aspectRatio: "16/9" }}>
          <FoodImage src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px 24px 0 0" }} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(11,15,25,0.6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={17} color="#fff" />
          </button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>{item.name}</div>
              <div style={{ color: theme.textMuted, fontSize: 13.5, marginTop: 5, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: theme.primary, whiteSpace: "nowrap" }}>${item.price.toFixed(2)}</div>
          </div>
          {item.calories && <div style={{ color: theme.textFaint, fontSize: 12, marginTop: 8 }}>{item.calories} kcal (approx.)</div>}

          {item.addOns.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Add-ons</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {item.addOns.map((ao) => {
                  const active = !!addOns.find((a) => a.name === ao.name);
                  return (
                    <button key={ao.name} onClick={() => toggleAddOn(ao)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px",
                      borderRadius: 12, border: `1px solid ${active ? theme.primary : theme.border}`,
                      background: active ? theme.primarySoft : theme.card, cursor: "pointer", fontFamily: FONT_STACK,
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: 5, border: `2px solid ${active ? theme.primary : theme.border}`,
                          background: active ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{active && <Check size={12} color="#fff" />}</span>
                        <span style={{ fontSize: 13.5, color: theme.text }}>{ao.name}</span>
                      </span>
                      <span style={{ fontSize: 13, color: theme.textMuted }}>+${ao.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Quantity</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 999, padding: "6px 8px" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: theme.bgAlt, color: theme.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={14} /></button>
              <span style={{ fontWeight: 700, fontSize: 15, minWidth: 18, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} /></button>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <PrimaryButton theme={theme} full size="lg" onClick={() => onConfirm(qty, addOns)}>
              Add {qty} to cart · ${total.toFixed(2)}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   RESTAURANT DETAIL PAGE
   ========================================================================= */
function RestaurantDetailPage({ theme, restaurant, navigate, addToCart, cart, favorites, toggleFavorite, openCart }) {
  const [activeCat, setActiveCat] = useState(restaurant?.menu?.[0]?.name);
  const [menuQuery, setMenuQuery] =
  useState("");
  const [sheetItem, setSheetItem] = useState(null);
  const [added, setAdded] = useState(null);
  const [reviews, setReviews] = useState([]);
const [reviewsLoading, setReviewsLoading] =
  useState(true);

useEffect(() => {
  if (!restaurant?.id) return;

  let cancelled = false;

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);

      const reviewData =
        await getRestaurantReviews(
          restaurant.id
        );

      if (cancelled) return;

      setReviews(
        (reviewData || []).map((review) => ({
          id: review.id,
          name:
            review.user?.name ||
            "Forkly customer",
          rating: review.rating,
          text:
            review.comment ||
            "Rated this restaurant.",
          avatar:
            review.user?.avatarUrl || null,
          date: new Date(
            review.createdAt
          ).toLocaleDateString(),
        }))
      );
    } catch (error) {
      if (!cancelled) {
        console.error(
          "Unable to load reviews:",
          error
        );
        setReviews([]);
      }
    } finally {
      if (!cancelled) {
        setReviewsLoading(false);
      }
    }
  };

  loadReviews();

  return () => {
    cancelled = true;
  };
}, [restaurant?.id]);

  if (!restaurant) return null;
  const isFav = favorites.has(restaurant.id);
  const cartCountHere = cart.filter((c) => c.restaurantId === restaurant.id).reduce((s, c) => s + c.qty, 0);
  const cartTotalHere = cart.filter((c) => c.restaurantId === restaurant.id).reduce((s, c) => s + c.qty * c.unitPrice, 0);
  

  const quickAdd = (item) => {
    if (item.addOns.length > 0) { setSheetItem(item); return; }
    addToCart(restaurant, item, 1, []);
    setAdded(item.id);
    setTimeout(() => setAdded(null), 900);
  };


  return (
  <div
    className="forkly-restaurant-detail"
    style={{
      paddingBottom:
        cartCountHere > 0 ? 96 : 40,
    }}
  >
    <style>{`
      .forkly-restaurant-hero {
        height: clamp(
          290px,
          34vw,
          410px
        ) !important;
        overflow: hidden;
        isolation: isolate;
      }

      .forkly-restaurant-hero img {
        transition:
          transform 0.6s ease;
      }

      .forkly-restaurant-hero:hover img {
        transform: scale(1.025);
      }

      .forkly-restaurant-hero button {
        width: 44px !important;
        height: 44px !important;
        border: 1px solid
          rgba(255, 255, 255, 0.22)
          !important;
        background:
          rgba(11, 15, 25, 0.56)
          !important;
        backdrop-filter: blur(12px);
        box-shadow:
          0 10px 30px
          rgba(0, 0, 0, 0.2);
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .forkly-restaurant-hero
        button:hover {
        transform: translateY(-2px);
        background:
          rgba(11, 15, 25, 0.75)
          !important;
      }

      .forkly-restaurant-content {
        max-width: 1080px !important;
        position: relative;
        z-index: 4;
      }

      .forkly-restaurant-content
        > div:first-child {
        margin-top: -68px;
        padding: 24px;
        background: ${theme.card};
        border: 1px solid
          ${theme.border};
        border-radius: 24px;
        box-shadow:
          0 24px 60px
          rgba(11, 15, 25, 0.14);
      }

      .forkly-restaurant-content h1 {
        font-size: 30px !important;
        letter-spacing:
          -0.8px !important;
      }

      @media (max-width: 768px) {
        .forkly-restaurant-hero {
          height: 255px !important;
        }

        .forkly-restaurant-content {
          padding:
            0 14px !important;
        }

        .forkly-restaurant-content
          > div:first-child {
          margin-top: -38px;
          padding: 18px;
          border-radius: 20px;
        }

        .forkly-restaurant-content h1 {
          font-size: 24px !important;
        }
      }

      @media (max-width: 480px) {
        .forkly-restaurant-hero {
          height: 225px !important;
        }

        .forkly-restaurant-hero button {
          width: 40px !important;
          height: 40px !important;
        }

        .forkly-restaurant-content
          > div:first-child {
          margin-top: -28px;
          padding: 16px;
        }
      }
    `}</style>
      <div
  className="forkly-restaurant-hero"
  style={{
    position: "relative",
    height: 260,
  }}
>
        <FoodImage src={restaurant.banner} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(11,15,25,0.75))" }} />
        <button onClick={() => navigate("restaurants")} style={{ position: "absolute", top: 16, left: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(11,15,25,0.55)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="#fff" />
        </button>
        <button onClick={() => toggleFavorite(restaurant.id)} style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(11,15,25,0.55)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={18} color={isFav ? "#FF6B35" : "#fff"} fill={isFav ? "#FF6B35" : "none"} />
        </button>
      </div>

      <div
  className="forkly-restaurant-content"
  style={{
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px 20px 0",
  }}
>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{restaurant.name}</h1>
            <div style={{ color: theme.textMuted, fontSize: 14, marginTop: 4 }}>{restaurant.tagline}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap", fontSize: 13, color: theme.textMuted }}>
              <StarRating rating={restaurant.rating} size={14} />
              <span>{restaurant.reviewCount} reviews</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} />{restaurant.time}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} />{restaurant.distance}</span>
              <span>{restaurant.priceLevel}</span>
            </div>
          </div>
          {restaurant.offer && (
            <div style={{ background: theme.accentSoft, color: theme.mode === "dark" ? theme.accent : "#8A6414", fontWeight: 700, fontSize: 12.5, padding: "8px 14px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
              <Tag size={13} /> {restaurant.offer}
            </div>
          )}
        </div>

        <div
  style={{
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 30,
  }}
>
  <div>
    <div
      style={{
        color: theme.primary,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.2,
        textTransform: "uppercase",
      }}
    >
      Explore our menu
    </div>

    <h2
      style={{
        margin: "5px 0 0",
        color: theme.text,
        fontSize: 24,
        fontWeight: 850,
        letterSpacing: -0.5,
      }}
    >
      Find your next favourite
    </h2>
  </div>

  <div
    style={{
      minWidth: 240,
      maxWidth: 360,
      flex: "1 1 260px",
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "11px 14px",
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      boxShadow:
        "0 10px 30px rgba(11,15,25,0.06)",
    }}
  >
    <Search
      size={17}
      color={theme.textMuted}
    />

    <input
      type="search"
      value={menuQuery}
      onChange={(event) =>
        setMenuQuery(event.target.value)
      }
      placeholder="Search dishes..."
      aria-label="Search this restaurant's menu"
      style={{
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        color: theme.text,
        fontFamily: FONT_STACK,
        fontSize: 13.5,
      }}
    />

    {menuQuery && (
      <button
        type="button"
        onClick={() => setMenuQuery("")}
        aria-label="Clear menu search"
        style={{
          padding: 2,
          border: "none",
          background: "transparent",
          color: theme.textMuted,
          cursor: "pointer",
          display: "flex",
        }}
      >
        <X size={15} />
      </button>
    )}
  </div>
</div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 22, overflowX: "auto", paddingBottom: 6, position: "sticky", top: 64, background: theme.bg, zIndex: 10 }} className="forkly-scrollx">
          {restaurant.menu.map((cat) => (
            <Chip key={cat.name} theme={theme} active={activeCat === cat.name} onClick={() => {
  setActiveCat(cat.name);
  setMenuQuery("");
}}>{cat.name}</Chip>
          ))}
        </div>

        {/* Menu items */}
        <div style={{ marginTop: 18 }}>
         { restaurant.menu
  .filter((category) =>
    menuQuery.trim()
      ? true
      : category.name === activeCat
  )
  .map((cat) => (
            <div key={cat.name} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cat.items
  .filter((item) => {
    const searchValue =
      menuQuery
        .trim()
        .toLowerCase();

    if (!searchValue) {
      return true;
    }

    return (
      item.name
        .toLowerCase()
        .includes(searchValue) ||
      (item.desc || "")
        .toLowerCase()
        .includes(searchValue)
    );
  })
  .map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 14, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 14, alignItems: "center" }}>
                  <FoodImage src={item.img} alt={item.name} style={{ width: 92, height: 92, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 13, height: 13, border: `1.5px solid ${item.veg ? theme.success : theme.error}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.veg ? theme.success : theme.error }} />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{item.name}</span>
                      {item.popular && <span style={{ fontSize: 10.5, fontWeight: 700, color: theme.mode === "dark" ? theme.accent : "#8A6414", background: theme.accentSoft, padding: "2px 7px", borderRadius: 999 }}>Popular</span>}
                      {item.spicy && <Flame size={13} color={theme.error} />}
                    </div>
                    <div style={{ color: theme.textMuted, fontSize: 12.5, marginTop: 4, lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.desc}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>${item.price.toFixed(2)}</span>
                      <button onClick={() => quickAdd(item)} style={{
                        display: "flex", alignItems: "center", gap: 5, background: added === item.id ? theme.success : theme.primarySoft,
                        color: added === item.id ? "#fff" : theme.primary, border: "none", borderRadius: 10, padding: "7px 13px",
                        fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: FONT_STACK, transition: "all .18s ease",
                      }}>
                        {added === item.id ? <Check size={14} /> : <Plus size={14} />} {added === item.id ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 44 }}>
          <SectionHeading theme={theme} title="Reviews" eyebrow={`${restaurant.rating} · ${restaurant.reviewCount} ratings`} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="forkly-grid-3">
          {reviewsLoading && (
  <div
    style={{
      color: theme.textMuted,
      fontSize: 13,
    }}
  >
    Loading reviews...
  </div>
)}

{!reviewsLoading &&
  reviews.length === 0 && (
    <div
      style={{
        color: theme.textMuted,
        fontSize: 13,
      }}
    >
      No reviews yet. Be the first to review
      this restaurant.
    </div>
  )}
            {reviews.map((rv) => (
              <div key={rv.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <img src={rv.avatar || IMG.avatar1} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{rv.name}</span>
                </div>
                <StarRating rating={rv.rating} size={12} />
                <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, lineHeight: 1.5 }}>{rv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cartCountHere > 0 && (
        <div style={{ position: "fixed", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 30, padding: "0 20px" }} className="forkly-sticky-cart">
          <button onClick={openCart} style={{
            width: "100%", maxWidth: 500, background: theme.primary, color: "#fff", border: "none", borderRadius: 16,
            padding: "15px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            boxShadow: theme.shadow, fontFamily: FONT_STACK, animation: "forkly-pop .25s ease",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 14 }}>
              <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{cartCountHere}</span>
              View cart
            </span>
            <span style={{ fontWeight: 800, fontSize: 15 }}>${cartTotalHere.toFixed(2)}</span>
          </button>
        </div>
      )}

      {sheetItem && (
        <ItemSheet
          theme={theme} item={sheetItem} restaurant={restaurant}
          onClose={() => setSheetItem(null)}
          onConfirm={(qty, addOns) => { addToCart(restaurant, sheetItem, qty, addOns); setSheetItem(null); }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   CART MATH HELPER
   ========================================================================= */
function computeCartTotals(cart, couponCode) {
  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const coupon = couponCode ? COUPONS[couponCode] : null;
  let discount = 0;
  let deliveryFee = subtotal > 0 ? 2.99 : 0;
  if (coupon) {
    if (coupon.type === "percent") discount = Math.min(subtotal * coupon.value, coupon.cap);
    if (coupon.type === "shipping") deliveryFee = 0;
  }
  const tax = Math.max(0, subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount) + tax + deliveryFee;
  return { subtotal, discount, deliveryFee, tax, total, coupon };
}

/* =========================================================================
   CART DRAWER
   ========================================================================= */
function CartDrawer({ theme, cart, updateQty, removeLine, onClose, onCheckout, couponCode, setCouponCode }) {
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [couponError, setCouponError] = useState("");
  useEffect(() => {
  let active = true;

  const loadAddresses = async () => {
    try {
      setAddressError("");

      const data = await getAddresses();

      if (active) {
        setAddresses(data);

        const defaultAddress =
          data.find((address) => address.isDefault) ||
          data[0];

        setAddressId(defaultAddress?.id || null);
      }
    } catch (error) {
      if (active) {
        setAddressError(error.message);
      }
    } finally {
      if (active) {
        setAddressLoading(false);
      }
    }
  };

  loadAddresses();

  return () => {
    active = false;
  };
}, []);
  const totals = computeCartTotals(cart, couponCode);
  const restaurantName = cart[0]?.restaurantName;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) { setCouponCode(code); setCouponError(""); }
    else { setCouponError("Invalid or expired code"); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div className="forkly-cart-drawer" style={{
        position: "relative", width: 420, maxWidth: "100%", height: "100%", background: theme.bg,
        display: "flex", flexDirection: "column", boxShadow: theme.shadow, animation: "forkly-slide-left .25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Your cart</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.text }}><X size={20} /></button>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.card, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShoppingBag size={26} color={theme.textMuted} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Your cart is empty</div>
            <div style={{ color: theme.textMuted, fontSize: 13.5, marginTop: 6 }}>Add dishes from a restaurant to get started.</div>
            <div style={{ marginTop: 18 }}><PrimaryButton theme={theme} onClick={onClose}>Browse restaurants</PrimaryButton></div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
              <div style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Store size={13} /> Ordering from <strong style={{ color: theme.text }}>{restaurantName}</strong>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cart.map((line) => (
                  <div key={line.id} style={{ display: "flex", gap: 12 }}>
                    <FoodImage src={line.img} alt={line.name} style={{ width: 62, height: 62, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{line.name}</span>
                        <span style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap" }}>${(line.unitPrice * line.qty).toFixed(2)}</span>
                      </div>
                      {line.addOns.length > 0 && (
                        <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>+ {line.addOns.map((a) => a.name).join(", ")}</div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 999, padding: "4px 6px" }}>
                          <button onClick={() => updateQty(line.id, -1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: theme.bgAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={11} /></button>
                          <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 12, textAlign: "center" }}>{line.qty}</span>
                          <button onClick={() => updateQty(line.id, 1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={11} /></button>
                        </div>
                        <button onClick={() => removeLine(line.id)} style={{ background: "none", border: "none", color: theme.textFaint, cursor: "pointer", display: "flex" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (try FORK20)"
                    style={{ flex: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13, outline: "none", fontFamily: FONT_STACK }}
                  />
                  <button onClick={applyCoupon} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "0 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", color: theme.text, fontFamily: FONT_STACK }}>Apply</button>
                </div>
                {couponError && <div style={{ color: theme.error, fontSize: 12, marginTop: 6 }}>{couponError}</div>}
                {couponCode && !couponError && (
                  <div style={{ color: theme.success, fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                    <Check size={13} /> {COUPONS[couponCode].label} applied
                  </div>
                )}
              </div>

              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Subtotal</span><span style={{ color: theme.text }}>${totals.subtotal.toFixed(2)}</span></div>
                {totals.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: theme.success }}><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Delivery fee</span><span style={{ color: theme.text }}>{totals.deliveryFee === 0 ? "Free" : `$${totals.deliveryFee.toFixed(2)}`}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Tax (8%)</span><span style={{ color: theme.text }}>${totals.tax.toFixed(2)}</span></div>
                <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 4, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
              </div>
            </div>

            <div style={{ padding: 22, borderTop: `1px solid ${theme.border}` }}>
              <PrimaryButton theme={theme} full size="lg" onClick={onCheckout}>Go to checkout · ${totals.total.toFixed(2)}</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   CHECKOUT PAGE
   ========================================================================= */
function CheckoutPage({
  theme,
  cart,
  couponCode,
  navigate,
  placeOrder,
}) {
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [addressLoading, setAddressLoading] =
    useState(true);
  const [addressError, setAddressError] =
    useState("");
    const [showAddressForm, setShowAddressForm] =
  useState(false);

const [addressSaving, setAddressSaving] =
  useState(false);

const [addressForm, setAddressForm] = useState({
  label: "Home",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
});

  const [payMethod, setPayMethod] =
    useState("card");
  const [cardId, setCardId] = useState(
    SAVED_CARDS[0]?.id
  );
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const loadAddresses = async () => {
      setAddressLoading(true);
      setAddressError("");

      try {
        const data = await getAddresses();

        setAddresses(data);

        const defaultAddress =
          data.find(
            (address) => address.isDefault
          ) || data[0];

        setAddressId(defaultAddress?.id || null);
      } catch (error) {
        setAddressError(error.message);
      } finally {
        setAddressLoading(false);
      }
    };

    loadAddresses();
  }, []);
  const handleSaveAddress = async () => {
  if (
    !addressForm.label.trim() ||
    !addressForm.line1.trim() ||
    !addressForm.city.trim()
  ) {
    setAddressError(
      "Label, address and city are required."
    );
    return;
  }

  setAddressSaving(true);
  setAddressError("");

  try {
    const savedAddress = await createAddress({
      label: addressForm.label.trim(),
      line1: addressForm.line1.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim() || undefined,
      postalCode:
        addressForm.postalCode.trim() || undefined,
      isDefault: addresses.length === 0,
    });

    setAddresses((current) => [
      ...current,
      savedAddress,
    ]);

    setAddressId(savedAddress.id);
    setShowAddressForm(false);

    setAddressForm({
      label: "Home",
      line1: "",
      city: "",
      state: "",
      postalCode: "",
    });
  } catch (error) {
    setAddressError(error.message);
  } finally {
    setAddressSaving(false);
  }
};

  const totals = computeCartTotals(
    cart,
    couponCode
  );

  const restaurantName =
    cart[0]?.restaurantName;

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Your cart is empty</div>
        <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>Add something delicious before checking out.</p>
        <PrimaryButton theme={theme} onClick={() => navigate("restaurants")}>Browse restaurants</PrimaryButton>
      </div>
    );
  }

  const handlePlace = async () => {
  if (!addressId) {
    setOrderError(
      "Please select or add a delivery address."
    );
    return;
  }

  setPlacing(true);
  setOrderError("");

  try {
    await placeOrder({
      addressId,
      payMethod,
    });
  } catch (error) {
    setOrderError(error.message);
  } finally {
    setPlacing(false);
  }
};

  const payOptions = [
    { id: "card", label: "Credit / Debit card", icon: CreditCard },
    { id: "upi", label: "UPI / Wallet", icon: Wallet },
    { id: "cash", label: "Cash on delivery", icon: Banknote },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, display: "flex" }}><ArrowLeft size={18} /></button>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Checkout</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 26 }} className="forkly-checkout-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}><MapPinned size={16} color={theme.primary} /> Delivery address</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {addressLoading && (
  <div style={{ color: theme.textMuted }}>
    Loading saved addresses...
  </div>
)}

{addressError && (
  <div style={{ color: theme.error }}>
    {addressError}
  </div>
)}
             {addresses.map((a) => (                <button key={a.id} onClick={() => setAddressId(a.id)} style={{
                  textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", padding: 14, borderRadius: 14,
                  border: `1.5px solid ${addressId === a.id ? theme.primary : theme.border}`, background: addressId === a.id ? theme.primarySoft : theme.card,
                  cursor: "pointer", fontFamily: FONT_STACK,
                }}>
                  <span style={{
                    width: 19, height: 19, borderRadius: "50%", border: `2px solid ${addressId === a.id ? theme.primary : theme.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                  }}>{addressId === a.id && <span style={{ width: 9, height: 9, borderRadius: "50%", background: theme.primary }} />}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.label}</div>
                    <div style={{ color: theme.textMuted, fontSize: 12.5, marginTop: 2 }}>{a.line1}, {a.city}</div>
                  </div>
                </button>
              ))}
             <button
  type="button"
  onClick={() =>
    setShowAddressForm((current) => !current)
  }
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: `1.5px dashed ${theme.border}`,
    borderRadius: 14,
    padding: 14,
    color: theme.textMuted,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: FONT_STACK,
  }}
>
  <PlusCircle size={15} />

  {showAddressForm
    ? "Cancel adding address"
    : "Add a new address"}
</button>

{showAddressForm && (
  <div
    style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <input
      value={addressForm.label}
      onChange={(event) =>
        setAddressForm((current) => ({
          ...current,
          label: event.target.value,
        }))
      }
      placeholder="Label, for example Home or Work"
      style={{
        background: theme.bgAlt,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: "11px 12px",
        color: theme.text,
        outline: "none",
        fontFamily: FONT_STACK,
      }}
    />

    <input
      value={addressForm.line1}
      onChange={(event) =>
        setAddressForm((current) => ({
          ...current,
          line1: event.target.value,
        }))
      }
      placeholder="House number, building and street"
      style={{
        background: theme.bgAlt,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: "11px 12px",
        color: theme.text,
        outline: "none",
        fontFamily: FONT_STACK,
      }}
    />

    <input
      value={addressForm.city}
      onChange={(event) =>
        setAddressForm((current) => ({
          ...current,
          city: event.target.value,
        }))
      }
      placeholder="City"
      style={{
        background: theme.bgAlt,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: "11px 12px",
        color: theme.text,
        outline: "none",
        fontFamily: FONT_STACK,
      }}
    />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
      }}
    >
      <input
        value={addressForm.state}
        onChange={(event) =>
          setAddressForm((current) => ({
            ...current,
            state: event.target.value,
          }))
        }
        placeholder="State"
        style={{
          width: "100%",
          background: theme.bgAlt,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: "11px 12px",
          color: theme.text,
          outline: "none",
          fontFamily: FONT_STACK,
          boxSizing: "border-box",
        }}
      />

      <input
        value={addressForm.postalCode}
        onChange={(event) =>
          setAddressForm((current) => ({
            ...current,
            postalCode: event.target.value,
          }))
        }
        placeholder="Postal code"
        style={{
          width: "100%",
          background: theme.bgAlt,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: "11px 12px",
          color: theme.text,
          outline: "none",
          fontFamily: FONT_STACK,
          boxSizing: "border-box",
        }}
      />
    </div>

    <PrimaryButton
      theme={theme}
      full
      onClick={handleSaveAddress}
      disabled={addressSaving}
    >
      {addressSaving
        ? "Saving address..."
        : "Save and use this address"}
    </PrimaryButton>
  </div>
)}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}><CreditCard size={16} color={theme.primary} /> Payment method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {payOptions.map((p) => {
                const Ico = p.icon;
                return (
                  <button key={p.id} onClick={() => setPayMethod(p.id)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14,
                    border: `1.5px solid ${payMethod === p.id ? theme.primary : theme.border}`, background: payMethod === p.id ? theme.primarySoft : theme.card,
                    cursor: "pointer", fontFamily: FONT_STACK,
                  }}>
                    <Ico size={17} color={payMethod === p.id ? theme.primary : theme.textMuted} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1, textAlign: "left" }}>{p.label}</span>
                    <span style={{
                      width: 19, height: 19, borderRadius: "50%", border: `2px solid ${payMethod === p.id ? theme.primary : theme.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{payMethod === p.id && <span style={{ width: 9, height: 9, borderRadius: "50%", background: theme.primary }} />}</span>
                  </button>
                );
              })}
              {payMethod === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, marginLeft: 8 }}>
                  {SAVED_CARDS.map((c) => (
                    <button key={c.id} onClick={() => setCardId(c.id)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12,
                      border: `1px solid ${cardId === c.id ? theme.primary : theme.border}`, background: theme.card, cursor: "pointer", fontFamily: FONT_STACK,
                    }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{c.brand}</span>
                      <span style={{ fontSize: 12.5, color: theme.textMuted }}>•••• {c.last4}</span>
                      <span style={{ fontSize: 11.5, color: theme.textFaint, marginLeft: "auto" }}>Exp {c.exp}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 20, position: "sticky", top: 90 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Order summary</div>
            <div style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 12 }}>{restaurantName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {cart.map((l) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: theme.textMuted }}>{l.qty}× {l.name}</span>
                  <span>${(l.unitPrice * l.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 7, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Subtotal</span><span style={{ color: theme.text }}>${totals.subtotal.toFixed(2)}</span></div>
              {totals.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: theme.success }}><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Delivery</span><span style={{ color: theme.text }}>{totals.deliveryFee === 0 ? "Free" : `$${totals.deliveryFee.toFixed(2)}`}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: theme.textMuted }}><span>Tax</span><span style={{ color: theme.text }}>${totals.tax.toFixed(2)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, borderTop: `1px solid ${theme.border}`, paddingTop: 10, marginTop: 2 }}><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
            </div>
            <div style={{ marginTop: 18 }}>
  {orderError && (
    <div
      style={{
        color: theme.error,
        fontSize: 12.5,
        marginBottom: 10,
        lineHeight: 1.4,
      }}
    >
      {orderError}
    </div>
  )}

  <PrimaryButton
    theme={theme}
    full
    size="lg"
    disabled={placing}
    onClick={handlePlace}
    icon={
      placing ? (
        <Loader2
          size={16}
          className="forkly-spin"
        />
      ) : null
    }
  >
    {placing
      ? "Placing order…"
      : `Place order · $${totals.total.toFixed(2)}`}
  </PrimaryButton>
</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, color: theme.textFaint, fontSize: 11.5 }}>
              <ShieldCheck size={13} /> Payments are simulated for this demo — no real charge occurs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ORDER TRACKING PAGE
   ========================================================================= */
const ORDER_STAGES = [
  { label: "Preparing", icon: ChefHat, note: "The restaurant has received your order" },
  { label: "Cooking", icon: Flame, note: "Your food is being freshly prepared" },
  { label: "Picked up", icon: Package, note: "Your delivery partner has your order" },
  { label: "On the way", icon: Truck, note: "Your order is heading to your address" },
  { label: "Delivered", icon: CheckCircle2, note: "Enjoy your meal!" },
];

const COURIER = { name: "Diego Marquez", rating: 4.9, vehicle: "Scooter · Blue Vespa", photo: IMG.courier, phone: "+1 (555) 019-2231" };

function OrderTrackingPage({
  theme,
  order,
  navigate,
  refreshOrder,
}) {
  const [
    trackingError,
    setTrackingError,
  ] = useState("");

  useEffect(() => {
    if (!order?.id || !refreshOrder) {
      return;
    }

    if (
      order.status === "DELIVERED" ||
      order.status === "CANCELLED"
    ) {
      return;
    }

    let cancelled = false;

    const loadLatestOrder = async () => {
      try {
        await refreshOrder(order.id);

        if (!cancelled) {
          setTrackingError("");
        }
      } catch (error) {
        if (!cancelled) {
          setTrackingError(error.message);
        }
      }
    };

    loadLatestOrder();

    const intervalId =
      window.setInterval(
        loadLatestOrder,
        2000
      );

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [
    order?.id,
    order?.status,
    refreshOrder,
  ]);


  if (!order) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No active order</div>
        <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>Place an order to see live tracking here.</p>
        <PrimaryButton theme={theme} onClick={() => navigate("restaurants")}>Browse restaurants</PrimaryButton>
      </div>
    );
  }

  const stage = order.stage;
  const pct = (stage / (ORDER_STAGES.length - 1)) * 100;
  const etaLeft = Math.max(2, 22 - stage * 5);
  const address = SAVED_ADDRESSES.find((a) => a.id === order.addressId);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, display: "flex" }}><ArrowLeft size={18} /></button>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Order #{order.id}</h1>
      </div>
      <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 22 }}>{order.restaurantName}</p>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 22 }}>
        {stage < ORDER_STAGES.length - 1 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12.5, color: theme.textMuted }}>Estimated arrival</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{etaLeft} min</div>
            </div>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Loader2 size={20} color={theme.primary} className="forkly-spin" />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: theme.successSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={22} color={theme.success} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Delivered</div>
              <div style={{ fontSize: 12.5, color: theme.textMuted }}>Enjoy your meal!</div>
            </div>
          </div>
        )}

        {/* Mock route map */}
        <div style={{ background: theme.bgAlt, borderRadius: 16, padding: "26px 18px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}><Store size={14} color="#fff" /></div>
              <span style={{ fontSize: 10.5, color: theme.textMuted }}>Restaurant</span>
            </div>
            <div style={{ position: "absolute", left: 30, right: 30, top: 15, borderTop: `2px dashed ${theme.border}`, zIndex: 0 }} />
            <div style={{
              position: "absolute", top: 1, left: `calc(${pct}% * 0.72 + 14%)`, zIndex: 1,
              transition: "left 1s ease", width: 28, height: 28, borderRadius: "50%", background: theme.accent,
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadowSoft,
            }}>
              <Truck size={14} color="#14171F" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: theme.success, display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={14} color="#fff" /></div>
              <span style={{ fontSize: 10.5, color: theme.textMuted }}>{address?.label || "You"}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          {ORDER_STAGES.map((s, i) => {
            const Ico = s.icon;
            const done = i <= stage;
            const isLast = i === ORDER_STAGES.length - 1;
            return (
              <div key={s.label} style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? theme.success : theme.bgAlt, color: done ? "#fff" : theme.textFaint,
                    transition: "background .3s ease", border: done ? "none" : `1px solid ${theme.border}`,
                  }}>
                    <Ico size={16} />
                  </div>
                  {!isLast && <div style={{ width: 2, flex: 1, minHeight: 30, background: i < stage ? theme.success : theme.border, transition: "background .3s ease" }} />}
                </div>
                <div style={{ paddingBottom: isLast ? 0 : 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: done ? theme.text : theme.textFaint }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{s.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {stage >= 2 && stage < ORDER_STAGES.length - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: theme.bgAlt, borderRadius: 14, padding: 14, marginTop: 6 }}>
            <img src={COURIER.photo} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{COURIER.name}</div>
              <div style={{ fontSize: 11.5, color: theme.textMuted }}>{COURIER.vehicle} · <StarRating rating={COURIER.rating} size={11} /></div>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: theme.primary, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Phone size={15} color="#fff" />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MessageCircle size={15} color={theme.text} />
            </button>
          </div>
        )}
      </div>

      {stage === ORDER_STAGES.length - 1 && (
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <PrimaryButton theme={theme} full onClick={() => navigate("orders")}>View order history</PrimaryButton>
        </div>
      )}
    </div>
  );
}
function ReviewModal({
  theme,
  order,
  onClose,
  onSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      await createReview({
        restaurantId: order.restaurantId,
        orderId: order.id,
        rating,
        comment:
          comment.trim() || undefined,
      });

      onSubmitted(order.id);
      onClose();
    } catch (submitError) {
      setError(
        submitError.message ||
          "Unable to submit your review"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: theme.overlay,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          padding: 24,
          boxShadow: theme.shadow,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "none",
            background: "none",
            color: theme.textMuted,
            cursor: "pointer",
          }}
        >
          <X size={19} />
        </button>

        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            marginBottom: 5,
          }}
        >
          Rate your order
        </div>

        <div
          style={{
            color: theme.textMuted,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          How was your experience with{" "}
          {order.restaurantName}?
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 18,
          }}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              style={{
                border: "none",
                background: "none",
                padding: 2,
                cursor: "pointer",
              }}
            >
              <Star
                size={30}
                color={theme.accent}
                fill={
                  value <= rating
                    ? theme.accent
                    : "none"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          rows={4}
          maxLength={1000}
          placeholder="Tell us what you liked or what could be improved..."
          style={{
            width: "100%",
            resize: "vertical",
            background: theme.card,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: 12,
            fontFamily: FONT_STACK,
            fontSize: 13.5,
            outline: "none",
            marginBottom: 12,
          }}
        />

        {error && (
          <div
            style={{
              color: theme.error,
              fontSize: 12.5,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <PrimaryButton
          theme={theme}
          full
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving
            ? "Submitting..."
            : "Submit review"}
        </PrimaryButton>
      </div>
    </div>
  );
}
/* =========================================================================
   ORDER HISTORY PAGE
   ========================================================================= */
function OrderHistoryPage({ theme, orders, navigate, reorder, trackOrder }) {
  const [reviewOrder, setReviewOrder] =
  useState(null);

const [
  reviewedOrderIds,
  setReviewedOrderIds,
] = useState(() => new Set());

const markOrderReviewed = (orderId) => {
  setReviewedOrderIds((current) => {
    const updated = new Set(current);
    updated.add(orderId);
    return updated;
  });
};
  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: theme.card, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Package size={26} color={theme.textMuted} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No orders yet</div>
        <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>Your order history and invoices will show up here.</p>
        <PrimaryButton theme={theme} onClick={() => navigate("restaurants")}>Browse restaurants</PrimaryButton>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, display: "flex" }}><ArrowLeft size={18} /></button>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Order history</h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[...orders].reverse().map((o) => {
          const delivered = o.stage >= ORDER_STAGES.length - 1;
          const reviewed =
  Boolean(o.review) ||
  reviewedOrderIds.has(o.id);
          return (
            <div key={o.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{o.restaurantName}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>{o.dateLabel} · Order #{o.id}</div>
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: "5px 12px", borderRadius: 999,
                  background: delivered ? theme.successSoft : theme.primarySoft, color: delivered ? theme.success : theme.primary,
                }}>
                  {delivered ? "Delivered" : ORDER_STAGES[o.stage].label}
                </span>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 10 }}>
                {o.items.map((l) => `${l.qty}× ${l.name}`).join(", ")}
              </div>
              <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      fontWeight: 800,
      fontSize: 15,
    }}
  >
    ${o.totals.total.toFixed(2)}
  </div>

  <div
    style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    }}
  >
    {delivered && !reviewed && (
      <button
        onClick={() => setReviewOrder(o)}
        style={{
          background: theme.accentSoft,
          color:
            theme.mode === "dark"
              ? theme.accent
              : "#8A6414",
          border: "none",
          borderRadius: 10,
          padding: "8px 14px",
          fontWeight: 700,
          fontSize: 12.5,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_STACK,
        }}
      >
        <Star size={13} />
        Rate order
      </button>
    )}

    {!delivered && (
      <button
        onClick={() => trackOrder(o.id)}
        style={{
          background: theme.primarySoft,
          color: theme.primary,
          border: "none",
          borderRadius: 10,
          padding: "8px 14px",
          fontWeight: 700,
          fontSize: 12.5,
          cursor: "pointer",
          fontFamily: FONT_STACK,
        }}
      >
        Track order
      </button>
    )}

    <button
      onClick={() => reorder(o)}
      style={{
        background: theme.primary,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "8px 14px",
        fontWeight: 700,
        fontSize: 12.5,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: FONT_STACK,
      }}
    >
      <RotateCcw size={13} />
      Reorder
    </button>
  </div>
</div>

{reviewOrder?.id === o.id && (
  <ReviewModal
    theme={theme}
    order={reviewOrder}
    onClose={() => setReviewOrder(null)}
    onSubmitted={markOrderReviewed}
  />
)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   FAVORITES PAGE
   ========================================================================= */
function FavoritesPage({
  theme,
  favorites,
  restaurants,
  navigate,
  openRestaurant,
  toggleFavorite,
}) {
  const favRestaurants =
  restaurants.filter((r) =>
    favorites.has(r.id)
  );
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 20px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted, display: "flex" }}><ArrowLeft size={18} /></button>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Your favorites</h1>
      </div>
      {favRestaurants.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Heart size={36} color={theme.textMuted} style={{ marginBottom: 12, opacity: 0.6 }} />
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No favorites yet</div>
          <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 18 }}>Tap the heart on any restaurant to save it here.</p>
          <PrimaryButton theme={theme} onClick={() => navigate("restaurants")}>Discover restaurants</PrimaryButton>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="forkly-grid-3">
          {favRestaurants.map((r) => (
            <RestaurantCard key={r.id} r={r} theme={theme} onOpen={openRestaurant} isFav={true} onToggleFav={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   PROFILE PAGE
   ========================================================================= */
function ProfilePage({
  theme,
  mode,
  setMode,
  user,
  navigate,
  favCount,
  orderCount,
  onLogout,
  onUserUpdated,
}) {
  const [tab, setTab] =
    useState("account");

  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileSaved, setProfileSaved] =
    useState(false);

  const [
    profileSaveError,
    setProfileSaveError,
  ] = useState("");

  const [
    profileAddresses,
    setProfileAddresses,
  ] = useState([]);

  const [
    profileAddressLoading,
    setProfileAddressLoading,
  ] = useState(false);

  const [
    profileAddressError,
    setProfileAddressError,
  ] = useState("");

  const [
    showProfileAddressForm,
    setShowProfileAddressForm,
  ] = useState(false);

  const [
    profileAddressSaving,
    setProfileAddressSaving,
  ] = useState(false);

  const [
    deletingAddressId,
    setDeletingAddressId,
  ] = useState(null);

  const [
    profileAddressForm,
    setProfileAddressForm,
  ] = useState({
    label: "Home",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const tabs = [
    {
      id: "account",
      label: "Account details",
      icon: User,
    },
    {
      id: "orders",
      label: "My orders",
      icon: Package,
    },
    {
      id: "addresses",
      label: "Saved addresses",
      icon: MapPin,
    },
    {
      id: "payment",
      label: "Payments",
      icon: CreditCard,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: SlidersHorizontal,
    },
  ];

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user?.name, user?.email]);

  useEffect(() => {
    if (tab !== "addresses") return;

    let cancelled = false;

    const loadProfileAddresses =
      async () => {
        setProfileAddressLoading(true);
        setProfileAddressError("");

        try {
          const data =
            await getAddresses();

          if (!cancelled) {
            setProfileAddresses(data);
          }
        } catch (requestError) {
          if (!cancelled) {
            setProfileAddressError(
              requestError.message
            );
          }
        } finally {
          if (!cancelled) {
            setProfileAddressLoading(
              false
            );
          }
        }
      };

    loadProfileAddresses();

    return () => {
      cancelled = true;
    };
  }, [tab, user?.id]);

  const handleSaveAccount = async () => {
    if (!name.trim()) {
      setProfileSaveError(
        "Your name is required."
      );
      return;
    }

    if (!email.includes("@")) {
      setProfileSaveError(
        "Enter a valid email address."
      );
      return;
    }

    setSavingProfile(true);
    setProfileSaveError("");
    setProfileSaved(false);

    try {
      const updatedUser =
        await apiRequest("/users/me", {
          method: "PATCH",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        });

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      setName(updatedUser.name || "");
      setEmail(updatedUser.email || "");
      setProfileSaved(true);

      window.setTimeout(() => {
        setProfileSaved(false);
      }, 2200);
    } catch (requestError) {
      setProfileSaveError(
        requestError.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveProfileAddress =
    async () => {
      if (
        !profileAddressForm.label.trim() ||
        !profileAddressForm.line1.trim() ||
        !profileAddressForm.city.trim()
      ) {
        setProfileAddressError(
          "Label, address and city are required."
        );
        return;
      }

      setProfileAddressSaving(true);
      setProfileAddressError("");

      try {
        const savedAddress =
          await createAddress({
            label:
              profileAddressForm.label.trim(),
            line1:
              profileAddressForm.line1.trim(),
            city:
              profileAddressForm.city.trim(),
            state:
              profileAddressForm.state.trim() ||
              undefined,
            postalCode:
              profileAddressForm.postalCode.trim() ||
              undefined,
            isDefault:
              profileAddresses.length === 0,
          });

        setProfileAddresses(
          (current) => [
            ...current,
            savedAddress,
          ]
        );

        setShowProfileAddressForm(false);

        setProfileAddressForm({
          label: "Home",
          line1: "",
          city: "",
          state: "",
          postalCode: "",
        });
      } catch (requestError) {
        setProfileAddressError(
          requestError.message
        );
      } finally {
        setProfileAddressSaving(false);
      }
    };

  const handleDeleteProfileAddress =
    async (addressId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this address?"
        );

      if (!confirmed) return;

      setDeletingAddressId(addressId);
      setProfileAddressError("");

      try {
        await deleteAddress(addressId);

        setProfileAddresses(
          (current) =>
            current.filter(
              (address) =>
                address.id !==
                addressId
            )
        );
      } catch (requestError) {
        setProfileAddressError(
          requestError.message
        );
      } finally {
        setDeletingAddressId(null);
      }
    };

  const selectTab = (tabId) => {
    if (tabId === "orders") {
      navigate("orders");
      return;
    }

    setTab(tabId);
  };

  return (
    <main
      className="forkly-profile-page"
      style={{
        maxWidth: 1180,
        minHeight:
          "calc(100vh - 72px)",
        margin: "0 auto",
        padding: "28px 24px 72px",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("home")}
        style={{
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          color: theme.textMuted,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 11.5,
          fontWeight: 700,
        }}
      >
        <ArrowLeft size={15} />
        Back to Home
      </button>

      <section
        className="forkly-profile-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 15,
          padding: "30px 34px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 28,
          color: "#ffffff",
          background:
            "linear-gradient(135deg, #ff6b35 0%, #e94f23 60%, #be3517 100%)",
          borderRadius: 27,
          boxShadow:
            "0 22px 50px rgba(218,72,26,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -110,
            right: 40,
            width: 280,
            height: 280,
            background:
              "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />

        <div
          className="forkly-profile-identity"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 17,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.primary,
              background: "#ffffff",
              border:
                "4px solid rgba(255,255,255,0.25)",
              borderRadius: 21,
              boxShadow:
                "0 14px 30px rgba(94,29,8,0.2)",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                width: "fit-content",
                padding: "5px 9px",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background:
                  "rgba(255,255,255,0.16)",
                border:
                  "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                fontSize: 9.5,
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={12} />
              Verified Forkly customer
            </div>

            <h1
              style={{
                margin: "9px 0 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 25,
                letterSpacing: -0.6,
              }}
            >
              {user?.name || "Customer"}
            </h1>

            <div
              style={{
                marginTop: 5,
                overflow: "hidden",
                color:
                  "rgba(255,255,255,0.76)",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 11.5,
              }}
            >
              {user?.email || ""}
            </div>
          </div>
        </div>

        <div
          className="forkly-profile-stats"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("orders")
            }
            style={{
              minWidth: 105,
              padding: "13px 15px",
              color: "#ffffff",
              background:
                "rgba(255,255,255,0.14)",
              border:
                "1px solid rgba(255,255,255,0.2)",
              borderRadius: 15,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 21,
                fontWeight: 900,
              }}
            >
              {orderCount}
            </div>

            <div
              style={{
                marginTop: 3,
                color:
                  "rgba(255,255,255,0.75)",
                fontSize: 9.5,
                fontWeight: 700,
              }}
            >
              ORDERS
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("favorites")
            }
            style={{
              minWidth: 105,
              padding: "13px 15px",
              color: "#ffffff",
              background:
                "rgba(255,255,255,0.14)",
              border:
                "1px solid rgba(255,255,255,0.2)",
              borderRadius: 15,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 21,
                fontWeight: 900,
              }}
            >
              {favCount}
            </div>

            <div
              style={{
                marginTop: 3,
                color:
                  "rgba(255,255,255,0.75)",
                fontSize: 9.5,
                fontWeight: 700,
              }}
            >
              FAVOURITES
            </div>
          </button>
        </div>
      </section>

      <section
        className="forkly-profile-layout"
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns:
            "245px minmax(0, 1fr)",
          gap: 22,
          alignItems: "start",
        }}
      >
        <aside
          className="forkly-profile-sidebar"
          style={{
            position: "sticky",
            top: 94,
            padding: 12,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 19,
            boxShadow: theme.shadowSoft,
          }}
        >
          <div
            className="forkly-profile-tabs forkly-scrollx"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {tabs.map((item) => {
              const TabIcon = item.icon;
              const active =
                tab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    selectTab(item.id)
                  }
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: active
                      ? theme.primary
                      : theme.textMuted,
                    background: active
                      ? theme.primarySoft
                      : "transparent",
                    border: active
                      ? `1px solid ${theme.primary}`
                      : "1px solid transparent",
                    borderRadius: 11,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: active
                      ? 800
                      : 650,
                    textAlign: "left",
                  }}
                >
                  <TabIcon size={16} />
                  {item.label}

                  {active && (
                    <ChevronRight
                      size={14}
                      style={{
                        marginLeft: "auto",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="forkly-profile-sidebar-logout"
            onClick={onLogout}
            style={{
              width: "100%",
              marginTop: 11,
              padding: "11px 12px",
              display: "flex",
              alignItems: "center",
              gap: 9,
              color: theme.error,
              background: theme.errorSoft,
              border:
                "1px solid transparent",
              borderRadius: 11,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 750,
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        <div
          className="forkly-profile-panel"
          style={{
            minWidth: 0,
            padding: 25,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            boxShadow: theme.shadowSoft,
          }}
        >
          {tab === "account" && (
            <div>
              <ProfilePanelHeading
                theme={theme}
                icon={<User size={19} />}
                title="Account details"
                description="Manage your personal information and account identity."
              />

              <div
                className="forkly-profile-form-grid"
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <ProfileField
                  theme={theme}
                  label="Full name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                />

                <ProfileField
                  theme={theme}
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {profileSaveError && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "11px 13px",
                    color: theme.error,
                    background:
                      theme.errorSoft,
                    border: `1px solid ${theme.error}`,
                    borderRadius: 11,
                    fontSize: 11.5,
                  }}
                >
                  {profileSaveError}
                </div>
              )}

              <div
                className="forkly-profile-save-row"
                style={{
                  marginTop: 20,
                  paddingTop: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: 15,
                  borderTop: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    color: theme.textFaint,
                    fontSize: 10.5,
                    lineHeight: 1.5,
                  }}
                >
                  Changes are saved securely
                  to your Forkly account.
                </div>

                <PrimaryButton
                  theme={theme}
                  onClick={
                    handleSaveAccount
                  }
                  disabled={
                    savingProfile
                  }
                >
                  {savingProfile ? (
                    <>
                      <Loader2
                        size={15}
                        className="forkly-spin"
                      />
                      Saving...
                    </>
                  ) : profileSaved ? (
                    <>
                      <Check size={15} />
                      Saved
                    </>
                  ) : (
                    "Save changes"
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}

          {tab === "addresses" && (
            <div>
              <ProfilePanelHeading
                theme={theme}
                icon={<MapPin size={19} />}
                title="Saved addresses"
                description="Manage the delivery locations available during checkout."
                action={
                  <button
                    type="button"
                    onClick={() =>
                      setShowProfileAddressForm(
                        (current) =>
                          !current
                      )
                    }
                    style={{
                      padding:
                        "9px 12px",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 6,
                      color: "#ffffff",
                      background:
                        theme.primary,
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {showProfileAddressForm ? (
                      <X size={14} />
                    ) : (
                      <PlusCircle
                        size={14}
                      />
                    )}

                    {showProfileAddressForm
                      ? "Cancel"
                      : "Add address"}
                  </button>
                }
              />

              {profileAddressError && (
                <div
                  style={{
                    marginTop: 17,
                    padding: "11px 13px",
                    color: theme.error,
                    background:
                      theme.errorSoft,
                    borderRadius: 11,
                    fontSize: 11.5,
                  }}
                >
                  {profileAddressError}
                </div>
              )}

              {showProfileAddressForm && (
                <div
                  className="forkly-profile-address-form"
                  style={{
                    marginTop: 19,
                    padding: 18,
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 16,
                  }}
                >
                  <div
                    className="forkly-address-form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: 13,
                    }}
                  >
                    <ProfileField
                      theme={theme}
                      label="Address label"
                      value={
                        profileAddressForm.label
                      }
                      onChange={(event) =>
                        setProfileAddressForm(
                          (current) => ({
                            ...current,
                            label:
                              event.target
                                .value,
                          })
                        )
                      }
                      placeholder="Home or Work"
                    />

                    <ProfileField
                      theme={theme}
                      label="City"
                      value={
                        profileAddressForm.city
                      }
                      onChange={(event) =>
                        setProfileAddressForm(
                          (current) => ({
                            ...current,
                            city:
                              event.target
                                .value,
                          })
                        )
                      }
                      placeholder="Your city"
                    />

                    <div className="forkly-profile-full-width">
                      <ProfileField
                        theme={theme}
                        label="Complete address"
                        value={
                          profileAddressForm.line1
                        }
                        onChange={(
                          event
                        ) =>
                          setProfileAddressForm(
                            (current) => ({
                              ...current,
                              line1:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="House number, building and street"
                      />
                    </div>

                    <ProfileField
                      theme={theme}
                      label="State"
                      value={
                        profileAddressForm.state
                      }
                      onChange={(event) =>
                        setProfileAddressForm(
                          (current) => ({
                            ...current,
                            state:
                              event.target
                                .value,
                          })
                        )
                      }
                      placeholder="State"
                    />

                    <ProfileField
                      theme={theme}
                      label="Postal code"
                      value={
                        profileAddressForm.postalCode
                      }
                      onChange={(event) =>
                        setProfileAddressForm(
                          (current) => ({
                            ...current,
                            postalCode:
                              event.target
                                .value,
                          })
                        )
                      }
                      placeholder="Postal code"
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 15,
                      display: "flex",
                      justifyContent:
                        "flex-end",
                    }}
                  >
                    <PrimaryButton
                      theme={theme}
                      onClick={
                        handleSaveProfileAddress
                      }
                      disabled={
                        profileAddressSaving
                      }
                    >
                      {profileAddressSaving ? (
                        <>
                          <Loader2
                            size={15}
                            className="forkly-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save address"
                      )}
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {profileAddressLoading ? (
                <div
                  style={{
                    padding: "50px 20px",
                    textAlign: "center",
                    color: theme.textMuted,
                  }}
                >
                  <Loader2
                    size={25}
                    className="forkly-spin"
                    color={theme.primary}
                  />

                  <div
                    style={{
                      marginTop: 11,
                      fontSize: 12,
                    }}
                  >
                    Loading your addresses...
                  </div>
                </div>
              ) : profileAddresses.length ===
                0 ? (
                <div
                  style={{
                    marginTop: 19,
                    padding: "45px 20px",
                    textAlign: "center",
                    background: theme.bg,
                    border: `1px dashed ${theme.borderStrong}`,
                    borderRadius: 17,
                  }}
                >
                  <MapPin
                    size={29}
                    color={theme.primary}
                  />

                  <div
                    style={{
                      marginTop: 11,
                      color: theme.text,
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    No saved addresses
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color: theme.textMuted,
                      fontSize: 11.5,
                    }}
                  >
                    Add a delivery address
                    to make checkout faster.
                  </div>
                </div>
              ) : (
                <div
                  className="forkly-profile-address-list"
                  style={{
                    marginTop: 19,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: 13,
                  }}
                >
                  {profileAddresses.map(
                    (address) => (
                      <article
                        key={address.id}
                        className="forkly-profile-address-card"
                        style={{
                          padding: 16,
                          display: "flex",
                          alignItems:
                            "flex-start",
                          gap: 11,
                          background:
                            theme.bg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 15,
                        }}
                      >
                        <div
                          style={{
                            width: 37,
                            height: 37,
                            flexShrink: 0,
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            color:
                              theme.primary,
                            background:
                              theme.primarySoft,
                            borderRadius: 11,
                          }}
                        >
                          <MapPinned
                            size={17}
                          />
                        </div>

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 6,
                              color:
                                theme.text,
                              fontSize: 12.5,
                              fontWeight: 800,
                            }}
                          >
                            {address.label}

                            {address.isDefault && (
                              <span
                                style={{
                                  padding:
                                    "3px 6px",
                                  color:
                                    theme.success,
                                  background:
                                    theme.successSoft,
                                  borderRadius: 999,
                                  fontSize: 8,
                                }}
                              >
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: 5,
                              color:
                                theme.textMuted,
                              fontSize: 10.5,
                              lineHeight: 1.55,
                            }}
                          >
                            {[
                              address.line1,
                              address.city,
                              address.state,
                              address.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProfileAddress(
                              address.id
                            )
                          }
                          disabled={
                            deletingAddressId ===
                            address.id
                          }
                          aria-label={`Delete ${address.label} address`}
                          style={{
                            padding: 5,
                            display: "flex",
                            color:
                              theme.error,
                            background:
                              "transparent",
                            border: "none",
                            cursor:
                              deletingAddressId ===
                              address.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {deletingAddressId ===
                          address.id ? (
                            <Loader2
                              size={15}
                              className="forkly-spin"
                            />
                          ) : (
                            <Trash2
                              size={15}
                            />
                          )}
                        </button>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "payment" && (
            <div>
              <ProfilePanelHeading
                theme={theme}
                icon={
                  <CreditCard size={19} />
                }
                title="Payments"
                description="Choose your preferred payment method securely during checkout."
              />

              <div
                className="forkly-payment-method-grid"
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: 13,
                }}
              >
                {[
                  {
                    title: "UPI",
                    description:
                      "Pay using your preferred UPI application.",
                    icon: Wallet,
                    color: "#8B5CF6",
                  },
                  {
                    title:
                      "Credit or debit card",
                    description:
                      "Secure card payment during checkout.",
                    icon: CreditCard,
                    color: "#FF6B35",
                  },
                  {
                    title:
                      "Cash on delivery",
                    description:
                      "Pay when your order reaches you.",
                    icon: Banknote,
                    color: "#16A34A",
                  },
                ].map((method) => {
                  const PaymentIcon =
                    method.icon;

                  return (
                    <article
                      key={method.title}
                      style={{
                        padding: 17,
                        color: theme.text,
                        background: theme.bg,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 15,
                      }}
                    >
                      <div
                        style={{
                          width: 41,
                          height: 41,
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          color:
                            method.color,
                          background: `${method.color}15`,
                          borderRadius: 12,
                        }}
                      >
                        <PaymentIcon
                          size={19}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 13,
                          fontSize: 12.5,
                          fontWeight: 800,
                        }}
                      >
                        {method.title}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          color:
                            theme.textMuted,
                          fontSize: 10.5,
                          lineHeight: 1.55,
                        }}
                      >
                        {method.description}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 15,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  color: theme.textMuted,
                  background:
                    theme.successSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 13,
                  fontSize: 11,
                  lineHeight: 1.6,
                }}
              >
                <ShieldCheck
                  size={18}
                  color={theme.success}
                  style={{
                    flexShrink: 0,
                  }}
                />

                Forkly does not display
                complete payment credentials.
                Payment information is handled
                securely during checkout.
              </div>
            </div>
          )}

          {tab === "preferences" && (
            <div>
              <ProfilePanelHeading
                theme={theme}
                icon={
                  <SlidersHorizontal
                    size={19}
                  />
                }
                title="Preferences"
                description="Personalise your Forkly appearance and notification choices."
              />

              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                <div
                  style={{
                    padding: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 17,
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 15,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: theme.text,
                        fontSize: 12.5,
                        fontWeight: 800,
                      }}
                    >
                      Appearance
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        color:
                          theme.textMuted,
                        fontSize: 10.5,
                      }}
                    >
                      Switch between light
                      and dark mode.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMode(
                        mode === "dark"
                          ? "light"
                          : "dark"
                      )
                    }
                    style={{
                      flexShrink: 0,
                      padding:
                        "9px 12px",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 7,
                      color: theme.text,
                      background:
                        theme.card,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 999,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 750,
                    }}
                  >
                    {mode === "dark" ? (
                      <Moon size={14} />
                    ) : (
                      <Sun size={14} />
                    )}

                    {mode === "dark"
                      ? "Dark mode"
                      : "Light mode"}
                  </button>
                </div>

                <ToggleRow
                  theme={theme}
                  label="Order updates"
                  desc="Get notified when your order status changes."
                />

                <ToggleRow
                  theme={theme}
                  label="Promotions and offers"
                  desc="Receive deals and discounts from restaurants."
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProfilePanelHeading({
  theme,
  icon,
  title,
  description,
  action,
}) {
  return (
    <div
      className="forkly-profile-panel-heading"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.primary,
            background: theme.primarySoft,
            borderRadius: 12,
          }}
        >
          {icon}
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              color: theme.text,
              fontSize: 17,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: theme.textMuted,
              fontSize: 10.5,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

function ProfileField({
  theme,
  label,
  type = "text",
  ...inputProps
}) {
  return (
    <label
      style={{
        display: "block",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 7,
          color: theme.textMuted,
          fontSize: 10.5,
          fontWeight: 750,
        }}
      >
        {label}
      </span>

      <input
        type={type}
        className="forkly-profile-input"
        style={{
          width: "100%",
          padding: "12px 13px",
          color: theme.text,
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 11,
          outline: "none",
          fontFamily: FONT_STACK,
          fontSize: 12.5,
        }}
        {...inputProps}
      />
    </label>
  );
}

function ToggleRow({ theme, label, desc, defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
        <div style={{ color: theme.textMuted, fontSize: 12.5, marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => setOn((v) => !v)} style={{
        width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
        background: on ? theme.primary : theme.border, transition: "background .2s ease", flexShrink: 0,
      }}>
        <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
      </button>
    </div>
  );
}

/* =========================================================================
   AUTH MODAL
   ========================================================================= */
function AuthModal({ theme, onClose, onAuth }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const submit = async () => {
  if (!email.includes("@")) {
    setError("Enter a valid email address");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  if (tab === "register" && !name.trim()) {
    setError("Enter your name");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const endpoint =
      tab === "login" ? "/auth/login" : "/auth/register";

    const body =
      tab === "login"
        ? { email, password }
        : {
            name,
            email,
            password,
            role: "CUSTOMER",
          };

    const result = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });

    localStorage.setItem(
      "forkly:accessToken",
      result.accessToken
    );

    localStorage.setItem(
      "forkly:refreshToken",
      result.refreshToken
    );

    onAuth(result.user);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
const handleGoogleCredential = useCallback(
  async (googleResponse) => {
    if (!googleResponse?.credential) {
      setError(
        "Google did not return a valid sign-in credential."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await apiRequest(
        "/auth/google",
        {
          method: "POST",
          body: JSON.stringify({
            credential:
              googleResponse.credential,
          }),
        }
      );

      localStorage.setItem(
        "forkly:accessToken",
        result.accessToken
      );

      localStorage.setItem(
        "forkly:refreshToken",
        result.refreshToken
      );

      onAuth(result.user);
    } catch (googleError) {
      setError(
        googleError.message ||
          "Unable to continue with Google."
      );
    } finally {
      setLoading(false);
    }
  },
  [onAuth]
);
useEffect(() => {
  const clientId =
    import.meta.env
      .VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    setError(
      "Google sign-in is not configured."
    );
    return undefined;
  }

  let cancelled = false;
  let timerId;
  let attempts = 0;

  const renderGoogleButton = () => {
    if (cancelled) return;

    if (
      !window.google?.accounts?.id ||
      !googleButtonRef.current
    ) {
      attempts += 1;

      if (attempts >= 50) {
        setError(
          "Google sign-in could not be loaded. Please refresh the page."
        );
        return;
      }

      timerId = window.setTimeout(
        renderGoogleButton,
        100
      );

      return;
    }

    const container =
      googleButtonRef.current;

    const availableWidth = Math.floor(
      container.getBoundingClientRect()
        .width
    );

    const buttonWidth = Math.max(
      200,
      Math.min(400, availableWidth)
    );

    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback:
        handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(
      container,
      {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text:
          tab === "login"
            ? "signin_with"
            : "signup_with",
        logo_alignment: "left",
        width: buttonWidth,
      }
    );
  };

  renderGoogleButton();

  return () => {
    cancelled = true;

    if (timerId) {
      window.clearTimeout(timerId);
    }
  };
}, [
  tab,
  handleGoogleCredential,
]);
  return (
  <div
    className="forkly-auth-modal"
  >
    <style>{`
      .forkly-auth-modal,
      .forkly-auth-modal * {
        box-sizing: border-box;
      }

      .forkly-auth-modal {
        position: fixed;
        inset: 0;
        z-index: 90;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 22px;
        font-family: ${FONT_STACK};
      }

      .forkly-auth-backdrop {
        position: absolute;
        inset: 0;
        background:
          rgba(35, 20, 13, 0.52);
        backdrop-filter: blur(8px);
      }

      .forkly-auth-shell {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 920px;
        max-height:
          calc(100vh - 44px);
        display: grid;
        grid-template-columns:
          minmax(0, 0.96fr)
          minmax(390px, 1.04fr);
        overflow: hidden;
        border:
          1px solid
          rgba(83, 51, 34, 0.1);
        border-radius: 30px;
        background: #ffffff;
        box-shadow:
          0 35px 100px
          rgba(35, 17, 9, 0.28);
        animation:
          forkly-auth-enter
          0.35s cubic-bezier(
            0.22,
            1,
            0.36,
            1
          ) both;
      }

      .forkly-auth-close {
        position: absolute;
        z-index: 5;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border:
          1px solid
          rgba(83, 51, 34, 0.1);
        border-radius: 11px;
        color: #786b64;
        background:
          rgba(255, 255, 255, 0.92);
        cursor: pointer;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .forkly-auth-close:hover {
        transform: rotate(6deg);
        background: #fff3ec;
      }

      .forkly-auth-visual {
        position: relative;
        min-height: 620px;
        overflow: hidden;
        color: #ffffff;
      }

      .forkly-auth-visual > img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .forkly-auth-visual::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(
            180deg,
            rgba(35, 15, 7, 0.13),
            rgba(49, 17, 4, 0.78)
          );
      }

      .forkly-auth-visual-content {
        position: relative;
        z-index: 2;
        min-height: 620px;
        display: flex;
        flex-direction: column;
        justify-content:
          space-between;
        padding: 32px;
      }

      .forkly-auth-brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: 900;
        letter-spacing: -0.6px;
      }

      .forkly-auth-brand-mark {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ff6030,
            #ff9661
          );
        box-shadow:
          0 12px 30px
          rgba(35, 10, 0, 0.24);
      }

      .forkly-auth-visual-badge {
        display: inline-flex;
        width: fit-content;
        margin-bottom: 13px;
        padding: 7px 10px;
        border:
          1px solid
          rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        background:
          rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .forkly-auth-visual h2 {
        max-width: 360px;
        margin: 0;
        font-size: 35px;
        line-height: 1.08;
        letter-spacing: -1.7px;
        font-weight: 900;
      }

      .forkly-auth-visual p {
        max-width: 350px;
        margin: 13px 0 0;
        color:
          rgba(255, 255, 255, 0.8);
        font-size: 13px;
        line-height: 1.6;
      }

      .forkly-auth-benefits {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 19px;
      }

      .forkly-auth-benefits span {
        padding: 7px 9px;
        border:
          1px solid
          rgba(255, 255, 255, 0.18);
        border-radius: 999px;
        background:
          rgba(255, 255, 255, 0.13);
        font-size: 10.5px;
        font-weight: 700;
        backdrop-filter: blur(8px);
      }

      .forkly-auth-form-side {
        min-width: 0;
        overflow-y: auto;
        padding: 48px 42px 36px;
        color: #211713;
        background:
          linear-gradient(
            180deg,
            #ffffff,
            #fffaf7
          );
      }

      .forkly-auth-heading {
        padding-right: 35px;
      }

      .forkly-auth-heading-label {
        color: #ff6330;
        font-size: 10.5px;
        font-weight: 900;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .forkly-auth-heading h2 {
        margin: 8px 0 0;
        font-size: 30px;
        line-height: 1.15;
        letter-spacing: -1.2px;
        font-weight: 900;
      }

      .forkly-auth-heading p {
        margin: 9px 0 0;
        color: #8a7b73;
        font-size: 13px;
        line-height: 1.5;
      }

      .forkly-auth-tabs {
        display: flex;
        gap: 5px;
        margin: 24px 0 21px;
        padding: 5px;
        border: 1px solid #eee2db;
        border-radius: 14px;
        background: #f9f2ed;
      }

      .forkly-auth-tab {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 10px;
        color: #84766f;
        background: transparent;
        cursor: pointer;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 800;
        transition:
          background 0.2s ease,
          color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-auth-tab-active {
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ff6030,
            #ff8150
          );
        box-shadow:
          0 9px 20px
          rgba(255, 96, 48, 0.2);
      }

      .forkly-auth-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .forkly-auth-field-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .forkly-auth-label {
        color: #4f413b;
        font-size: 11.5px;
        font-weight: 800;
      }

      .forkly-auth-field {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 48px;
        padding: 0 13px;
        border: 1px solid #e9ddd6;
        border-radius: 13px;
        color: #9b8d86;
        background: #ffffff;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .forkly-auth-field:focus-within {
        border-color: #ff7443;
        box-shadow:
          0 0 0 4px
          rgba(255, 107, 53, 0.1);
      }

      .forkly-auth-field input {
        width: 100%;
        min-width: 0;
        border: none;
        outline: none;
        color: #211713;
        background: transparent;
        font-family: inherit;
        font-size: 13.5px;
      }

      .forkly-auth-field input::placeholder {
        color: #b2a49d;
      }

      .forkly-auth-password-toggle {
        flex-shrink: 0;
        display: flex;
        padding: 5px;
        border: none;
        color: #8e8079;
        background: transparent;
        cursor: pointer;
      }

      .forkly-auth-hint {
        color: #9b8d86;
        font-size: 10.5px;
        line-height: 1.45;
      }

      .forkly-auth-error {
        padding: 10px 12px;
        border:
          1px solid
          rgba(220, 38, 38, 0.14);
        border-radius: 11px;
        color: #c62828;
        background: #fff1f1;
        font-size: 11.5px;
        line-height: 1.4;
      }

      .forkly-auth-submit {
        width: 100%;
        min-height: 49px;
        margin-top: 2px;
        border: none;
        border-radius: 13px;
        color: #ffffff;
        background:
          linear-gradient(
            135deg,
            #ff6030,
            #ff8452
          );
        box-shadow:
          0 14px 27px
          rgba(255, 96, 48, 0.23);
        cursor: pointer;
        font-family: inherit;
        font-size: 13.5px;
        font-weight: 900;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          opacity 0.2s ease;
      }

      .forkly-auth-submit:hover:not(:disabled) {
        transform:
          translateY(-2px);
        box-shadow:
          0 18px 32px
          rgba(255, 96, 48, 0.29);
      }

      .forkly-auth-submit:disabled {
        opacity: 0.62;
        cursor: wait;
      }

      .forkly-auth-terms {
        margin-top: 17px;
        color: #a0928b;
        font-size: 10.5px;
        line-height: 1.5;
        text-align: center;
      }

      @keyframes forkly-auth-enter {
        from {
          opacity: 0;
          transform:
            translateY(18px)
            scale(0.97);
        }

        to {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      @media (max-width: 760px) {
        .forkly-auth-modal {
          padding: 14px;
        }

        .forkly-auth-shell {
          max-width: 480px;
          max-height:
            calc(100vh - 28px);
          grid-template-columns: 1fr;
          border-radius: 24px;
        }

        .forkly-auth-visual {
          display: none;
        }

        .forkly-auth-form-side {
          padding: 38px 27px 28px;
        }
      }

      @media (max-width: 420px) {
        .forkly-auth-modal {
          padding: 9px;
        }

        .forkly-auth-shell {
          max-height:
            calc(100vh - 18px);
          border-radius: 20px;
        }

        .forkly-auth-close {
          top: 12px;
          right: 12px;
          width: 33px;
          height: 33px;
        }

        .forkly-auth-form-side {
          padding: 31px 19px 23px;
        }

        .forkly-auth-heading h2 {
          font-size: 26px;
        }

        .forkly-auth-tabs {
          margin-top: 20px;
        }
      }

      @media (
        prefers-reduced-motion:
        reduce
      ) {
        .forkly-auth-shell,
        .forkly-auth-submit,
        .forkly-auth-close {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>

    <div
      className="forkly-auth-backdrop"
      onClick={onClose}
    />

    <div
      className="forkly-auth-shell"
      role="dialog"
      aria-modal="true"
      aria-label={
        tab === "login"
          ? "Customer sign in"
          : "Customer registration"
      }
    >
      <button
        type="button"
        className="forkly-auth-close"
        onClick={onClose}
        aria-label="Close authentication"
      >
        <X size={18} />
      </button>

      <section
        className="forkly-auth-visual"
      >
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=88&auto=format&fit=crop"
          alt="A colourful bowl of fresh food"
        />

        <div
          className="forkly-auth-visual-content"
        >
          <div
            className="forkly-auth-brand"
          >
            <span
              className="forkly-auth-brand-mark"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M17 8V27M11 8V18C11 24 23 24 23 18V8M17 27V55"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M43 8C35 17 35 27 43 33V55M43 8V33H51V8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            Forkly
          </div>

          <div>
            <div
              className="forkly-auth-visual-badge"
            >
              Fresh choices every day
            </div>

            <h2>
              Your favourite meals are
              closer than you think.
            </h2>

            <p>
              Explore local restaurants,
              order in a few taps and
              follow your delivery right
              to your door.
            </p>

            <div
              className="forkly-auth-benefits"
            >
              <span>✓ Live tracking</span>
              <span>✓ Exclusive offers</span>
              <span>✓ Easy reordering</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="forkly-auth-form-side"
      >
        <div
          className="forkly-auth-heading"
        >
          <div
            className="forkly-auth-heading-label"
          >
            Customer portal
          </div>

          <h2>
            {tab === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p>
            {tab === "login"
              ? "Sign in to continue ordering your favourites."
              : "Join Forkly and make your next meal effortless."}
          </p>
        </div>

        <div
          className="forkly-auth-tabs"
        >
          {[
            "login",
            "register",
          ].map((currentTab) => (
            <button
              key={currentTab}
              type="button"
              onClick={() => {
                setTab(currentTab);
                setError("");
              }}
              className={`forkly-auth-tab ${
                tab === currentTab
                  ? "forkly-auth-tab-active"
                  : ""
              }`}
            >
              {currentTab === "login"
                ? "Sign in"
                : "Create account"}
            </button>
          ))}
        </div>

        <form
          className="forkly-auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
        <div
  ref={googleButtonRef}
  style={{
    width: "100%",
    minHeight: 44,
    display: "flex",
    justifyContent: "center",
  }}
/>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: theme.textMuted,
    fontSize: 12,
  }}
>
  <div
    style={{
      flex: 1,
      height: 1,
      background: theme.border,
    }}
  />

  <span>
    or continue with email
  </span>

  <div
    style={{
      flex: 1,
      height: 1,
      background: theme.border,
    }}
  />
</div>

          {tab === "register" && (
            <div
              className="forkly-auth-field-group"
            >
              <label
                className="forkly-auth-label"
                htmlFor="customer-name"
              >
                Full name
              </label>

              <div
                className="forkly-auth-field"
              >
                <User size={16} />

                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div
            className="forkly-auth-field-group"
          >
            <label
              className="forkly-auth-label"
              htmlFor="customer-email"
            >
              Email address
            </label>

            <div
              className="forkly-auth-field"
            >
              <Mail size={16} />

              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div
            className="forkly-auth-field-group"
          >
            <label
              className="forkly-auth-label"
              htmlFor="customer-password"
            >
              Password
            </label>

            <div
              className="forkly-auth-field"
            >
              <Lock size={16} />

              <input
                id="customer-password"
                type={
                  showPw
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="At least 8 characters"
                autoComplete={
                  tab === "login"
                    ? "current-password"
                    : "new-password"
                }
              />

              <button
                type="button"
                className="forkly-auth-password-toggle"
                onClick={() =>
                  setShowPw(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showPw
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPw ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            {tab === "register" && (
              <div
                className="forkly-auth-hint"
              >
                Use at least eight
                characters.
              </div>
            )}
          </div>

          {error && (
            <div
              className="forkly-auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="forkly-auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : tab === "login"
                ? "Sign in to Forkly"
                : "Create my account"}
          </button>
        </form>

        <div
          className="forkly-auth-terms"
        >
          By continuing, you agree to
          Forkly’s Terms of Service and
          Privacy Policy.
        </div>
      </section>
    </div>
  </div>
);
}

/* =========================================================================
   NOTIFICATIONS PANEL
   ========================================================================= */
const NOTIFICATIONS = [
  { id: 1, icon: Truck, title: "Order on the way", desc: "Your Patty House order is arriving soon", time: "2 min ago", unread: true },
  { id: 2, icon: Percent, title: "20% off Basil & Bloom", desc: "Limited-time offer on all pizzas today", time: "1 hr ago", unread: true },
  { id: 3, icon: CheckCircle2, title: "Order delivered", desc: "Your Spice Route order was delivered", time: "Yesterday", unread: false },
  { id: 4, icon: Sparkles, title: "You earned 40 points", desc: "Loyalty points added to your account", time: "2 days ago", unread: false },
];

function NotificationsPanel({
  theme,
  notifications,
  loading,
  error,
  onRead,
  onReadAll,
  onClose,
}) {
  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const formatNotificationTime = (
    createdAt
  ) => {
    const createdTime = new Date(
      createdAt
    ).getTime();

    const seconds = Math.max(
      0,
      Math.floor(
        (Date.now() - createdTime) /
          1000
      )
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return new Date(
      createdAt
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const notificationSymbol = (
    type
  ) => {
    if (
      type === "order_delivered"
    ) {
      return "🎉";
    }

    if (
      type === "order_picked_up"
    ) {
      return "🛵";
    }

    if (type === "order") {
      return "✓";
    }

    return "🔔";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 85,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
        }}
      />

      
       <div
        className="forkly-notif-panel"
        style={{
          position: "absolute",
          top: 70,
          right: 20,
          width: 380,
          maxWidth:
            "calc(100vw - 40px)",
          maxHeight: "72vh",
          overflowY: "auto",
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          boxShadow: theme.shadow,
          animation:
            "forkly-pop .18s ease",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 12,
            padding: "15px 16px",
            background: theme.card,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              Notifications
            </div>

            <div
              style={{
                color: theme.textMuted,
                fontSize: 11.5,
                marginTop: 2,
              }}
            >
              {unreadCount === 0
                ? "You’re all caught up"
                : `${unreadCount} unread ${
                    unreadCount === 1
                      ? "notification"
                      : "notifications"
                  }`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onReadAll}
                style={{
                  border: "none",
                  background:
                    theme.primarySoft,
                  color: theme.primary,
                  borderRadius: 9,
                  padding: "7px 9px",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily:
                    FONT_STACK,
                }}
              >
                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              style={{
                border: "none",
                background:
                  "transparent",
                color: theme.textMuted,
                width: 30,
                height: 30,
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              padding: "42px 20px",
              textAlign: "center",
              color: theme.textMuted,
              fontSize: 13,
            }}
          >
            Loading notifications...
          </div>
        ) : error &&
          notifications.length === 0 ? (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color:
                  theme.danger ||
                  "#dc2626",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Unable to load notifications
            </div>

            <div
              style={{
                color: theme.textMuted,
                fontSize: 12,
              }}
            >
              {error}
            </div>
          </div>
        ) : notifications.length ===
          0 ? (
          <div
            style={{
              padding: "46px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 10,
              }}
            >
              🔔
            </div>

            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              No notifications yet
            </div>

            <div
              style={{
                color: theme.textMuted,
                fontSize: 12,
                marginTop: 5,
              }}
            >
              Your order updates will
              appear here.
            </div>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() =>
                  onRead(
                    notification.id
                  )
                }
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 12,
                  padding: "14px 16px",
                  border: "none",
                  borderBottom: `1px solid ${theme.border}`,
                  background:
                    notification.isRead
                      ? theme.card
                      : theme.primarySoft,
                  color: theme.text,
                  textAlign: "left",
                  cursor:
                    notification.isRead
                      ? "default"
                      : "pointer",
                  fontFamily:
                    FONT_STACK,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background:
                      notification.isRead
                        ? theme.bgAlt
                        : theme.card,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize: 17,
                  }}
                >
                  {notificationSymbol(
                    notification.type
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 7,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      {notification.title}
                    </div>

                    {!notification.isRead && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius:
                            "50%",
                          background:
                            theme.primary,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color:
                        theme.textMuted,
                      marginTop: 4,
                      lineHeight: 1.45,
                    }}
                  >
                    {notification.body}
                  </div>

                  <div
                    style={{
                      fontSize: 10.5,
                      color:
                        theme.textMuted,
                      marginTop: 6,
                    }}
                  >
                    {formatNotificationTime(
                      notification.createdAt
                    )}
                  </div>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   404 PAGE
   ========================================================================= */
function NotFoundPage({ theme, navigate }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "100px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 72, fontWeight: 800, color: theme.primary, lineHeight: 1 }}>404</div>
      <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>This page isn't on the menu</div>
      <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 8, marginBottom: 22 }}>The page you're looking for doesn't exist or has moved.</p>
      <PrimaryButton theme={theme} onClick={() => navigate("home")}>Back to home</PrimaryButton>
    </div>
  );
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; }
      .forkly-root { -webkit-font-smoothing: antialiased; }
      .forkly-root ::selection { background: ${theme.primary}; color: #fff; }
      .forkly-scrollx { scrollbar-width: none; -ms-overflow-style: none; }
      .forkly-scrollx::-webkit-scrollbar { display: none; }
      .forkly-root ::-webkit-scrollbar { width: 8px; height: 8px; }
      .forkly-root ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 8px; }
      button { font-family: inherit; }
      input:focus, button:focus-visible, select:focus { outline: 2px solid ${theme.primary}; outline-offset: 1px; }

      @keyframes forkly-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      @keyframes forkly-slide-up { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes forkly-slide-left { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes forkly-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes forkly-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes forkly-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .forkly-spin { animation: forkly-spin 1s linear infinite; }
      .forkly-page-enter { animation: forkly-fade-in .35s ease; }

      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
      }
      .forkly-header-search:focus-within {
  border-color: ${theme.primary} !important;
  box-shadow:
    0 0 0 4px ${theme.primarySoft};
}

.forkly-desktop-nav button:hover {
  color: ${theme.primary} !important;
}

.forkly-customer-profile {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.forkly-customer-profile:hover {
  transform: translateY(-1px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadowSoft};
}

@media (max-width: 1120px) {
  .forkly-logo-tagline,
  .forkly-profile-name {
    display: none !important;
  }

  .forkly-desktop-search {
    width: 210px !important;
  }

  .forkly-header-inner {
    gap: 12px !important;
  }
}

@media (max-width: 860px) {
  .forkly-desktop-nav,
  .forkly-desktop-search {
    display: none !important;
  }

  .forkly-mobile-menu-btn {
    width: 40px;
    height: 40px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .forkly-header-actions
    > button:not(
      .forkly-mobile-menu-btn
    ),
  .forkly-header-actions
    > .forkly-bell-wrap {
    display: none !important;
  }

  .forkly-header-inner {
    min-height: 64px !important;
    padding: 10px 16px !important;
  }
}

@media (max-width: 480px) {
  .forkly-mobile-quick-actions {
    grid-template-columns:
      repeat(2, minmax(0, 1fr))
      !important;
  }

  .forkly-customer-logo > div:first-child {
    width: 37px !important;
    height: 37px !important;
  }
}

      @media (max-width: 980px) {
        .forkly-hero-grid { grid-template-columns: 1fr !important; }
        .forkly-hero-image { order: -1; }
        .forkly-home-split { grid-template-columns: 1fr !important; }
        .forkly-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
        .forkly-listing-grid { grid-template-columns: 1fr !important; }
        .forkly-filters-sidebar { display: none !important; }
        .forkly-filters-btn { display: flex !important; }
        .forkly-checkout-grid { grid-template-columns: 1fr !important; }
        .forkly-footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }
      @media (max-width: 768px) {
        .forkly-desktop-nav, .forkly-desktop-search { display: none !important; }
        .forkly-mobile-menu-btn { display: flex !important; }
        .forkly-bottom-nav { display: block !important; }
        .forkly-grid-2, .forkly-grid-3 { grid-template-columns: 1fr !important; }
        .forkly-cart-drawer { width: 100% !important; }
        .forkly-root h1 { font-size: 26px !important; }
        .forkly-hero-grid h1 { font-size: 38px !important; }
        .forkly-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      }
      @media (max-width: 768px) {
  .forkly-root {
    padding-bottom: 76px;
  }

  .forkly-header-inner {
    padding: 10px 14px !important;
    gap: 10px !important;
  }

  .forkly-header-actions {
    margin-left: auto;
    gap: 6px !important;
  }

  .forkly-header-actions
    button[aria-label="Toggle theme"],
  .forkly-header-actions
    button[aria-label="Notifications"],
  .forkly-header-actions
    button[aria-label="Favorites"],
  .forkly-header-actions
    button[aria-label="Cart"],
  .forkly-header-actions
    button[aria-label="Profile"] {
    display: none !important;
  }

  .forkly-mobile-menu-btn {
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.border} !important;
    border-radius: 11px;
    background: ${theme.card} !important;
  }

  .forkly-hero-section {
    padding: 24px 16px 4px !important;
    overflow: hidden;
  }

  .forkly-hero-grid {
    gap: 26px !important;
  }

  .forkly-hero-copy {
    text-align: left;
  }

  .forkly-hero-copy h1 {
    font-size: 38px !important;
    line-height: 1.08 !important;
    letter-spacing: -1.2px !important;
  }

  .forkly-hero-copy p {
    font-size: 15px !important;
    line-height: 1.55 !important;
  }

  .forkly-hero-search {
    flex-direction: column !important;
    gap: 10px !important;
  }

  .forkly-hero-search > div {
    width: 100% !important;
  }

  .forkly-hero-search > button {
    width: 100% !important;
    justify-content: center !important;
  }

  .forkly-hero-image {
    order: initial !important;
    margin-top: 2px;
  }

  .forkly-hero-image > div:first-child {
    aspect-ratio: 16 / 11 !important;
    border-radius: 20px !important;
  }

  .forkly-hero-image > div:nth-child(2) {
    top: 12px !important;
    left: 10px !important;
  }

  .forkly-hero-image > div:nth-child(3) {
    right: 10px !important;
    bottom: 12px !important;
  }
}

@media (max-width: 480px) {
  .forkly-header-inner {
    padding: 9px 12px !important;
  }

  .forkly-hero-section {
    padding: 18px 14px 2px !important;
  }

  .forkly-hero-copy h1 {
    font-size: 33px !important;
    letter-spacing: -1px !important;
  }

  .forkly-hero-copy p {
    font-size: 14px !important;
    margin-top: 14px !important;
  }

  .forkly-hero-search {
    margin-top: 20px !important;
  }

  .forkly-hero-image > div:first-child {
    aspect-ratio: 4 / 3 !important;
  }

  .forkly-hero-image > div:nth-child(2),
  .forkly-hero-image > div:nth-child(3) {
    transform: scale(0.9);
  }
}
@media (max-width: 1024px) {
  .forkly-categories-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 768px) {
  .forkly-categories-page {
    padding: 24px 14px 94px !important;
  }

  .forkly-categories-hero {
    padding: 25px 20px !important;
    margin-bottom: 18px !important;
    border-radius: 19px !important;
  }

  .forkly-categories-hero h1 {
    font-size: 30px !important;
    line-height: 1.15 !important;
    letter-spacing: -0.6px !important;
  }

  .forkly-categories-hero p {
    font-size: 14px !important;
  }

  .forkly-categories-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr)) !important;
    gap: 12px !important;
  }

  .forkly-categories-grid > button {
    min-width: 0 !important;
    min-height: 164px !important;
    padding: 16px !important;
  }

  .forkly-category-description {
    display: none !important;
  }
}

@media (max-width: 420px) {
  .forkly-categories-hero {
    padding: 22px 17px !important;
  }

  .forkly-categories-hero h1 {
    font-size: 27px !important;
  }

  .forkly-categories-grid {
    gap: 10px !important;
  }

  .forkly-categories-grid > button {
    min-height: 154px !important;
    padding: 14px !important;
  }

  .forkly-categories-grid
    > button
    > div:first-child {
    width: 46px !important;
    height: 46px !important;
    margin-bottom: 13px !important;
  }
}
@media (max-width: 900px) {
  .forkly-offers-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .forkly-offers-page {
    padding: 24px 14px 94px !important;
  }

  .forkly-offers-hero {
    padding: 25px 20px !important;
    margin-bottom: 18px !important;
    border-radius: 19px !important;
  }

  .forkly-offers-hero h1 {
    font-size: 30px !important;
    line-height: 1.15 !important;
    letter-spacing: -0.6px !important;
  }

  .forkly-offers-hero p {
    font-size: 14px !important;
  }

  .forkly-offers-grid {
    gap: 14px !important;
  }

  .forkly-offers-grid > article {
    padding: 18px !important;
    border-radius: 18px !important;
    min-width: 0 !important;
  }
}

@media (max-width: 420px) {
  .forkly-offers-hero {
    padding: 22px 17px !important;
  }

  .forkly-offers-hero h1 {
    font-size: 27px !important;
  }

  .forkly-offers-grid > article {
    padding: 16px !important;
  }
}
.forkly-bell-wrap {
  position: relative;
  display: inline-flex;
}

.forkly-bell-celebrate button {
  animation:
    forkly-bell-hurray
    0.7s ease-in-out 4;
  background:
    ${theme.primarySoft} !important;
  color:
    ${theme.primary} !important;
}

.forkly-bell-celebrate::after {
  content: "Hurray! 🎉";
  position: absolute;
  top: 46px;
  left: 50%;
  z-index: 100;
  white-space: nowrap;
  pointer-events: none;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${theme.primary};
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  box-shadow: ${theme.shadow};
  animation:
    forkly-hurray-message
    5s ease forwards;
}

.forkly-bell-celebrate::before {
  content: "✨";
  position: absolute;
  z-index: 101;
  top: -12px;
  right: -10px;
  pointer-events: none;
  font-size: 18px;
  animation:
    forkly-hurray-sparkle
    1s ease-in-out 4;
}

@keyframes forkly-bell-hurray {
  0%,
  100% {
    transform:
      rotate(0deg)
      scale(1);
  }

  25% {
    transform:
      rotate(-14deg)
      scale(1.12);
  }

  50% {
    transform:
      rotate(14deg)
      scale(1.18);
  }

  75% {
    transform:
      rotate(-8deg)
      scale(1.1);
  }
}

@keyframes forkly-hurray-message {
  0% {
    opacity: 0;
    transform:
      translate(-50%, -8px)
      scale(0.8);
  }

  12%,
  78% {
    opacity: 1;
    transform:
      translate(-50%, 0)
      scale(1);
  }

  100% {
    opacity: 0;
    transform:
      translate(-50%, -5px)
      scale(0.95);
  }
}

@keyframes forkly-hurray-sparkle {
  0%,
  100% {
    opacity: 0;
    transform:
      translateY(4px)
      scale(0.7);
  }

  50% {
    opacity: 1;
    transform:
      translateY(-5px)
      scale(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .forkly-bell-celebrate button,
  .forkly-bell-celebrate::after,
  .forkly-bell-celebrate::before {
    animation: none !important;
  }
}
.forkly-hero-promises span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.forkly-hero-shell {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.forkly-hero-search {
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.forkly-hero-search:focus-within {
  border-color:
    ${theme.primary} !important;
  box-shadow:
    0 18px 45px
    rgba(255, 107, 53, 0.14) !important;
}

.forkly-hero-photo img {
  transition: transform 0.6s ease;
}

.forkly-hero-image:hover
  .forkly-hero-photo img {
  transform: scale(1.035);
}

@media (max-width: 980px) {
  .forkly-hero-shell {
    padding: 40px !important;
  }

  .forkly-hero-grid {
    grid-template-columns:
      1fr !important;
    gap: 38px !important;
  }

  .forkly-hero-image {
    order: initial !important;
    max-width: 650px;
  }

  .forkly-hero-copy h1 {
    max-width: 650px !important;
  }
}

@media (max-width: 768px) {
  .forkly-hero-section {
    padding:
      18px 14px 4px !important;
  }

  .forkly-hero-shell {
    padding:
      30px 20px 22px !important;
    border-radius: 25px !important;
  }

  .forkly-hero-copy h1 {
    margin-top: 18px !important;
    font-size: 40px !important;
    line-height: 1.04 !important;
    letter-spacing:
      -1.4px !important;
  }

  .forkly-hero-copy p {
    margin-top: 16px !important;
    font-size: 14px !important;
  }

  .forkly-hero-search {
    padding: 6px !important;
    flex-direction: column !important;
  }

  .forkly-hero-search-field {
    width: 100% !important;
  }

  .forkly-hero-search > button {
    width: 100% !important;
    justify-content:
      center !important;
  }

  .forkly-hero-community {
    margin-top: 22px !important;
  }

  .forkly-hero-photo {
    aspect-ratio:
      4 / 3 !important;
    border-width: 4px !important;
    border-radius: 22px !important;
  }

  .forkly-hero-delivery-card {
    top: 12px !important;
    left: 10px !important;
  }

  .forkly-hero-rating-card {
    right: 10px !important;
    bottom: 14px !important;
  }
}

@media (max-width: 480px) {
  .forkly-hero-shell {
    padding:
      25px 16px 18px !important;
    border-radius: 21px !important;
  }

  .forkly-hero-eyebrow {
    font-size: 10.5px !important;
  }

  .forkly-hero-copy h1 {
    font-size: 34px !important;
    letter-spacing:
      -1.1px !important;
  }

  .forkly-hero-promises {
    gap: 10px 14px !important;
  }

  .forkly-hero-community {
    align-items:
      flex-start !important;
  }

  .forkly-hero-live-card {
    display: none !important;
  }

  .forkly-hero-delivery-card,
  .forkly-hero-rating-card {
    transform: scale(0.86);
  }

  .forkly-hero-delivery-card {
    transform-origin: top left;
  }

  .forkly-hero-rating-card {
    transform-origin:
      bottom right;
  }
}
.forkly-home-category-card:hover {
  transform: translateY(-5px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

.forkly-category-photo {
  overflow: visible;
}

.forkly-category-photo img {
  transition: transform 0.35s ease;
}

.forkly-home-category-card:hover
  .forkly-category-photo img {
  transform: scale(1.07);
}

@media (max-width: 768px) {
  .forkly-home-categories-section {
    padding:
      34px 14px 4px !important;
  }

  .forkly-home-category-list {
    margin-right: -14px;
    padding-right: 14px !important;
  }

  .forkly-home-category-card {
    min-width: 124px !important;
    flex-basis: 124px !important;
    border-radius: 17px !important;
  }

  .forkly-category-photo {
    width: 68px !important;
    height: 68px !important;
  }
}

@media (max-width: 480px) {
  .forkly-home-category-card {
    min-width: 112px !important;
    flex-basis: 112px !important;
  }

  .forkly-category-photo {
    width: 62px !important;
    height: 62px !important;
  }

  .forkly-category-explore-text {
    display: none;
  }
}
.forkly-category-page-card:hover {
  transform: translateY(-6px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

.forkly-category-page-card
  .forkly-category-card-image img {
  transition: transform 0.45s ease;
}

.forkly-category-page-card:hover
  .forkly-category-card-image img {
  transform: scale(1.07);
}

.forkly-category-card-link svg {
  transition: transform 0.2s ease;
}

.forkly-category-page-card:hover
  .forkly-category-card-link svg {
  transform: translateX(3px);
}

@media (max-width: 980px) {
  .forkly-categories-hero {
    grid-template-columns:
      1fr !important;
    padding: 38px !important;
  }

  .forkly-categories-hero-visual {
    min-height: 330px !important;
    max-width: 650px;
  }

  .forkly-categories-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      ) !important;
  }
}

@media (max-width: 768px) {
  .forkly-categories-page {
    padding:
      20px 14px 94px !important;
  }

  .forkly-categories-hero {
    padding:
      29px 22px 22px !important;
    border-radius: 23px !important;
  }

  .forkly-categories-hero h1 {
    font-size: 36px !important;
    line-height: 1.07 !important;
    letter-spacing:
      -1.1px !important;
  }

  .forkly-categories-hero-visual {
    min-height: 270px !important;
  }

  .forkly-category-page-card {
    min-height: 0 !important;
    padding: 0 !important;
  }

  .forkly-category-page-card
    > .forkly-category-card-image {
    width: 100% !important;
    height: 145px !important;
    margin: 0 !important;
  }
}

@media (max-width: 520px) {
  .forkly-categories-hero {
    padding: 25px 17px !important;
  }

  .forkly-categories-hero h1 {
    font-size: 31px !important;
  }

  .forkly-categories-hero-actions
    > button {
    width: 100%;
    justify-content: center;
  }

  .forkly-categories-hero-visual {
    min-height: 225px !important;
  }

  .forkly-categories-grid {
    gap: 10px !important;
  }

  .forkly-category-page-card
    > .forkly-category-card-image {
    width: 100% !important;
    height: 112px !important;
    margin: 0 !important;
  }

  .forkly-category-card-content {
    padding: 13px !important;
  }

  .forkly-category-description {
    display: none !important;
  }

  .forkly-category-card-link {
    margin-top: 9px !important;
    font-size: 10.5px !important;
  }
}
.forkly-restaurant-card:hover {
  transform: translateY(-6px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

.forkly-restaurant-card-image img {
  transition: transform 0.48s ease;
}

.forkly-restaurant-card:hover
  .forkly-restaurant-card-image img {
  transform: scale(1.055);
}

.forkly-restaurant-heart:hover {
  transform: scale(1.08);
}

.forkly-restaurant-card-footer svg {
  transition: transform 0.2s ease;
}

.forkly-restaurant-card:hover
  .forkly-restaurant-card-footer svg {
  transform: translateX(3px);
}

@media (max-width: 480px) {
  .forkly-restaurant-card {
    border-radius: 18px !important;
  }

  .forkly-restaurant-card-image {
    aspect-ratio:
      16 / 10 !important;
  }

  .forkly-restaurant-tagline {
    display: none !important;
  }
}
.forkly-restaurant-search-box:focus-within {
  border-color:
    ${theme.primary} !important;
  box-shadow:
    0 0 0 4px
    ${theme.primarySoft};
}

.forkly-listing-category-chip {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.forkly-listing-category-chip:hover {
  transform: translateY(-1px);
  border-color:
    ${theme.primary} !important;
}

@media (max-width: 1100px) {
  .forkly-restaurant-results-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      ) !important;
  }
}

@media (max-width: 980px) {
  .forkly-listing-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-filters-sidebar {
    display: none !important;
  }

  .forkly-filters-btn {
    display: flex !important;
  }
}

@media (max-width: 700px) {
  .forkly-restaurants-page {
    padding:
      18px 14px 94px !important;
  }

  .forkly-restaurants-hero {
    padding: 27px 21px !important;
    align-items:
      flex-start !important;
    border-radius: 22px !important;
  }

  .forkly-restaurants-hero h1 {
    font-size: 32px !important;
  }

  .forkly-result-summary {
    display: none;
  }

  .forkly-restaurant-toolbar {
    padding: 11px !important;
    border-radius: 15px !important;
  }

  .forkly-restaurant-search-row {
    flex-wrap: wrap;
  }

  .forkly-restaurant-search-box {
    flex-basis: 100% !important;
  }

  .forkly-restaurant-search-row
    > select {
    min-height: 43px;
    flex: 1;
    min-width: 0 !important;
  }

  .forkly-filters-btn {
    min-height: 43px;
  }

  .forkly-results-heading {
    align-items:
      flex-end !important;
  }

  .forkly-restaurant-results-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }
}

@media (max-width: 420px) {
  .forkly-restaurants-hero {
    padding: 24px 17px !important;
  }

  .forkly-restaurants-hero h1 {
    font-size: 29px !important;
  }
}
.forkly-offer-benefits span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.forkly-offer-card:hover {
  transform: translateY(-6px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

.forkly-offer-order-button svg {
  transition: transform 0.2s ease;
}

.forkly-offer-order-button:hover svg {
  transform: translateX(4px);
}

@media (max-width: 900px) {
  .forkly-offers-hero {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-offers-hero-card {
    width: 100%;
    max-width: 430px !important;
    margin: 0 !important;
    transform:
      rotate(0deg) !important;
  }

  .forkly-offers-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .forkly-offers-page {
    padding:
      18px 14px 94px !important;
  }

  .forkly-offers-hero {
    padding:
      31px 22px !important;
    border-radius: 23px !important;
  }

  .forkly-offers-hero h1 {
    font-size: 37px !important;
    line-height: 1.06 !important;
    letter-spacing:
      -1.2px !important;
  }

  .forkly-offer-card {
    padding: 0 !important;
    border-radius: 19px !important;
  }

  .forkly-offer-card-body {
    padding: 18px !important;
  }
}

@media (max-width: 480px) {
  .forkly-offers-hero {
    padding:
      27px 17px !important;
  }

  .forkly-offers-hero h1 {
    font-size: 32px !important;
  }

  .forkly-offers-hero-card {
    padding: 20px !important;
  }

  .forkly-offers-section-heading {
    align-items:
      flex-start !important;
  }

  .forkly-offer-code-row {
    flex-direction:
      column !important;
  }

  .forkly-offer-code-row > button {
    width: 100%;
    min-height: 43px;
  }
}
.forkly-home-offer-image img {
  transition: transform 0.55s ease;
}

.forkly-home-offer-banner:hover
  .forkly-home-offer-image img {
  transform: scale(1.05);
}

.forkly-testimonial-card:hover {
  transform: translateY(-5px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

@media (max-width: 1100px) {
  .forkly-home-popular-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      ) !important;
  }
}

@media (max-width: 850px) {
  .forkly-home-offer-banner {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-home-offer-image {
    min-height: 235px !important;
  }

  .forkly-testimonials-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .forkly-home-popular-section {
    padding:
      38px 14px 5px !important;
  }

  .forkly-home-offer-copy {
    padding:
      31px 22px !important;
  }

  .forkly-home-offer-copy h2 {
    font-size: 30px !important;
  }

  .forkly-home-offer-banner {
    margin-top: 35px !important;
    border-radius: 22px !important;
  }
}

@media (max-width: 580px) {
  .forkly-home-popular-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-home-offer-copy {
    padding:
      27px 18px !important;
  }

  .forkly-home-offer-copy h2 {
    font-size: 27px !important;
  }

  .forkly-home-offer-image {
    min-height: 190px !important;
  }
}
.forkly-how-card:hover {
  transform: translateY(-5px);
  border-color:
    ${theme.primary} !important;
  box-shadow: ${theme.shadow} !important;
}

.forkly-customer-footer button:hover {
  color: ${theme.primary};
}

@media (max-width: 900px) {
  .forkly-how-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-footer-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      ) !important;
  }
}

@media (max-width: 768px) {
  .forkly-how-section {
    padding:
      43px 14px 24px !important;
  }

  .forkly-how-shell {
    padding:
      31px 20px !important;
    border-radius: 22px !important;
  }

  .forkly-how-shell h2 {
    font-size: 28px !important;
  }

  .forkly-customer-footer {
    margin-top: 47px !important;
  }

  .forkly-footer-cta {
    padding: 23px 20px !important;
  }
}

@media (max-width: 580px) {
  .forkly-footer-cta {
    align-items:
      flex-start !important;
    flex-direction:
      column !important;
  }

  .forkly-footer-cta > button {
    width: 100%;
    justify-content: center;
  }

  .forkly-footer-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
    gap: 27px !important;
  }

  .forkly-footer-bottom {
    align-items:
      flex-start !important;
    flex-direction:
      column !important;
  }
}
.forkly-profile-input {
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.forkly-profile-input:focus {
  border-color:
    ${theme.primary} !important;
  box-shadow:
    0 0 0 4px
    ${theme.primarySoft};
}

.forkly-profile-full-width {
  grid-column: 1 / -1;
}

.forkly-profile-address-card {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.forkly-profile-address-card:hover {
  transform: translateY(-2px);
  border-color:
    ${theme.primary} !important;
}

@media (max-width: 850px) {
  .forkly-profile-layout {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-profile-sidebar {
    position: static !important;
    overflow: hidden;
  }

  .forkly-profile-tabs {
    overflow-x: auto;
    flex-direction: row !important;
  }

  .forkly-profile-tabs > button {
    width: auto !important;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .forkly-profile-tabs
    > button
    svg:last-child {
    display: none;
  }

  .forkly-profile-sidebar-logout {
    width: auto !important;
  }

  .forkly-profile-address-list {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }
}

@media (max-width: 650px) {
  .forkly-profile-page {
    padding:
      18px 14px 94px !important;
  }

  .forkly-profile-hero {
    padding: 25px 19px !important;
    align-items:
      flex-start !important;
    flex-direction:
      column !important;
    border-radius: 22px !important;
  }

  .forkly-profile-stats {
    width: 100%;
  }

  .forkly-profile-stats > button {
    flex: 1;
    min-width: 0 !important;
  }

  .forkly-profile-panel {
    padding: 19px !important;
  }

  .forkly-profile-form-grid,
  .forkly-address-form-grid,
  .forkly-payment-method-grid {
    grid-template-columns:
      minmax(0, 1fr) !important;
  }

  .forkly-profile-full-width {
    grid-column: auto;
  }

  .forkly-profile-save-row,
  .forkly-profile-panel-heading {
    align-items:
      flex-start !important;
    flex-direction:
      column !important;
  }

  .forkly-profile-save-row
    > button,
  .forkly-profile-panel-heading
    > button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .forkly-profile-identity {
    align-items:
      flex-start !important;
  }

  .forkly-profile-identity
    > div:first-child {
    width: 61px !important;
    height: 61px !important;
    border-radius: 18px !important;
    font-size: 23px !important;
  }
}
    `}</style>
  );
}

function ConfirmDialog({ theme, title, desc, confirmLabel, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div style={{ position: "relative", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, maxWidth: 360, width: "100%", boxShadow: theme.shadow, animation: "forkly-pop .2s ease" }}>
        <div style={{ fontWeight: 800, fontSize: 16.5, marginBottom: 8 }}>{title}</div>
        <p style={{ color: theme.textMuted, fontSize: 13.5, lineHeight: 1.5, marginBottom: 20 }}>{desc}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: FONT_STACK }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: theme.primary, color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: FONT_STACK }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function mapBackendOrder(order) {
  const statusToStage = {
    PENDING: 0,
    ACCEPTED: 0,
    PREPARING: 1,
    READY: 1,
    PICKED_UP: 2,
    ON_THE_WAY: 3,
    DELIVERED: 4,
    CANCELLED: 0,
  };

  const restaurantName =
    order.restaurant?.name || "Restaurant";

  return {
    restaurantId:
  order.restaurantId ||
  order.restaurant?.id,

review: order.review || null,
    id: order.id,
    orderNumber: order.orderNumber,
    restaurantName,
    restaurantId: order.restaurantId,
    addressId: order.addressId,
    status: order.status,
    stage: statusToStage[order.status] ?? 0,
    payMethod: order.payment?.method,
    dateLabel: new Date(
      order.createdAt
    ).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),

    items: (order.items || []).map((item) => ({
      id: item.id,
      itemId: item.foodItemId,
      restaurantId: order.restaurantId,
      restaurantName,
      name: item.nameSnapshot,
      unitPrice: Number(item.priceSnapshot),
      qty: item.quantity,
      img: item.foodItem?.imageUrl || null,
      addOns: (item.addOns || []).map((addOn) => ({
        id: addOn.addOnId,
        name: addOn.nameSnapshot,
        price: Number(addOn.priceSnapshot),
      })),
    })),

    totals: {
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      deliveryFee: Number(order.deliveryFee),
      tax: Number(order.tax),
      total: Number(order.total),
    },
  };
}

function App() {
  const [mode, setMode] = useState("dark");
  const [initialLoading, setInitialLoading] = useState(true);

  const [coupons, setCoupons] =
  useState([]);

const [
  couponsLoading,
  setCouponsLoading,
] = useState(true);

const [
  couponsError,
  setCouponsError,
] = useState("");

  const [view, setView] = useState("home");
  const [pendingCategory, setPendingCategory] = useState("all");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] =
  useState(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
  if (view === "home") {
    setQuery("");
  }
}, [view]);
  const [restaurants, setRestaurants] = useState([]);
const [restaurantsLoading, setRestaurantsLoading] =
  useState(true);
const [restaurantsError, setRestaurantsError] =
  useState("");

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);

  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [
  notifications,
  setNotifications,
] = useState([]);

const [
  notificationsLoading,
  setNotificationsLoading,
] = useState(true);

const [
  notificationsError,
  setNotificationsError,
] = useState("");

const [
  celebrateDelivery,
  setCelebrateDelivery,
] = useState(false);
useEffect(() => {
  let cancelled = false;
  let initialized = false;
  let knownIds = new Set();
  let celebrationTimer;

  async function loadNotifications() {
    try {
      const latestNotifications =
        await getNotifications();

      if (cancelled) {
        return;
      }

      if (initialized) {
        const newDelivery =
          latestNotifications.find(
            (notification) =>
              notification.type ===
                "order_delivered" &&
              !knownIds.has(
                notification.id
              )
          );

        if (newDelivery) {
          setCelebrateDelivery(
            true
          );

          window.clearTimeout(
            celebrationTimer
          );

          celebrationTimer =
            window.setTimeout(() => {
              setCelebrateDelivery(
                false
              );
            }, 5000);
        }
      }

      knownIds = new Set(
        latestNotifications.map(
          (notification) =>
            notification.id
        )
      );

      initialized = true;

      setNotifications(
        latestNotifications
      );

      setNotificationsError("");
    } catch (error) {
      if (!cancelled) {
        setNotificationsError(
          error.message ||
            "Unable to load notifications"
        );
      }
    } finally {
      if (!cancelled) {
        setNotificationsLoading(
          false
        );
      }
    }
  }

  loadNotifications();

  const pollingInterval =
    window.setInterval(
      loadNotifications,
      8000
    );

  return () => {
    cancelled = true;

    window.clearInterval(
      pollingInterval
    );

    window.clearTimeout(
      celebrationTimer
    );
  };
}, []);
const handleNotificationRead =
  async (notificationId) => {
    const notification =
      notifications.find(
        (item) =>
          item.id ===
          notificationId
      );

    if (
      !notification ||
      notification.isRead
    ) {
      return;
    }

    try {
      await markNotificationRead(
        notificationId
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            item.id ===
            notificationId
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
      );
    } catch (error) {
      setNotificationsError(
        error.message ||
          "Unable to update notification"
      );
    }
  };

const handleMarkAllNotificationsRead =
  async () => {
    try {
      await markAllNotificationsRead();

      setNotifications(
        (current) =>
          current.map((item) => ({
            ...item,
            isRead: true,
          }))
      );
    } catch (error) {
      setNotificationsError(
        error.message ||
          "Unable to update notifications"
      );
    }
  };
  const [pendingAdd, setPendingAdd] = useState(null);
  useEffect(() => {
  let cancelled = false;

  async function loadActiveOffers() {
    setCouponsLoading(true);
    setCouponsError("");

    try {
      const activeCoupons =
        await getActiveCoupons();

      if (!cancelled) {
        setCoupons(activeCoupons);
      }
    } catch (error) {
      if (!cancelled) {
        setCouponsError(
          error.message ||
            "Unable to load offers"
        );
      }
    } finally {
      if (!cancelled) {
        setCouponsLoading(false);
      }
    }
  }

  loadActiveOffers();

  return () => {
    cancelled = true;
  };
}, []);

  const theme = THEMES[mode];
  useEffect(() => {
  let active = true;

  const loadRestaurants = async () => {
    try {
      setRestaurantsError("");

      const data = await getRestaurants();

      if (active) {
        setRestaurants(data);
      }
    } catch (error) {
      if (active) {
        setRestaurantsError(error.message);
      }
    } finally {
      if (active) {
        setRestaurantsLoading(false);
      }
    }
  };

  loadRestaurants();

  return () => {
    active = false;
  };
}, []);

  /* ---- Load saved preferences and verify session ---- */
useEffect(() => {
  let cancelled = false;

  const safeGet = async (key) => {
    try {
      const result =
        await window.storage.get(key);

      return result
        ? JSON.parse(result.value)
        : null;
    } catch {
      return null;
    }
  };

  async function load() {
    const [
      savedMode,
      savedCart,
      savedFavorites,
    ] = await Promise.all([
      safeGet("forkly:theme"),
      safeGet("forkly:cart"),
      safeGet("forkly:favorites"),
    ]);

    if (cancelled) return;

    if (savedMode) {
      setMode(savedMode);
    }

    if (savedCart) {
      setCart(savedCart);
    }

    if (savedFavorites) {
      setFavorites(
        new Set(savedFavorites)
      );
    }

    const accessToken =
      localStorage.getItem(
        "forkly:accessToken"
      );

    const refreshToken =
      localStorage.getItem(
        "forkly:refreshToken"
      );

    if (!accessToken && !refreshToken) {
      setUser(null);
      setIsAuthed(false);
      setOrders([]);
      setInitialLoading(false);
      return;
    }

    try {
      const currentUser =
        await apiRequest("/auth/me");

      if (cancelled) return;

      if (!currentUser?.id) {
        throw new Error(
          "Unable to verify customer session"
        );
      }

      setUser(currentUser);
      setIsAuthed(true);
    } catch (sessionError) {
      if (cancelled) return;

      console.warn(
        "Customer session could not be restored:",
        sessionError
      );

      setUser(null);
      setIsAuthed(false);
      setOrders([]);
    } finally {
      if (!cancelled) {
        setInitialLoading(false);
      }
    }
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);
  /* ---- Load orders for the logged-in customer ---- */
useEffect(() => {
  if (initialLoading) return;

  if (!isAuthed) {
    setOrders([]);
    return;
  }

  let cancelled = false;

  const loadCustomerOrders = async () => {
    try {
      const data = await getMyOrders();

      if (!cancelled) {
        setOrders(
          data.map((order) =>
            mapBackendOrder(order)
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to load customer orders:",
        error
      );
    }
  };

  loadCustomerOrders();

  return () => {
    cancelled = true;
  };
}, [initialLoading, isAuthed, user?.id]);

  /* ---- Persist on change (skip during initial load) ---- */
  useEffect(() => { if (!initialLoading) window.storage.set("forkly:theme", JSON.stringify(mode)).catch(() => {}); }, [mode, initialLoading]);
  useEffect(() => { if (!initialLoading) window.storage.set("forkly:cart", JSON.stringify(cart)).catch(() => {}); }, [cart, initialLoading]);
  useEffect(() => { if (!initialLoading) window.storage.set("forkly:favorites", JSON.stringify(Array.from(favorites))).catch(() => {}); }, [favorites, initialLoading]);

  useEffect(() => {
  const currentHistoryState =
    window.history.state || {};

  window.history.replaceState(
    {
      ...currentHistoryState,
      forklyPortal: "customer",
      forklyView: "home",
      forklyParams: null,
    },
    "",
    window.location.href
  );

  const handleBrowserNavigation = (
    event
  ) => {
    const historyState =
      event.state || {};

    const previousView =
      historyState.forklyPortal ===
        "customer" &&
      historyState.forklyView
        ? historyState.forklyView
        : "home";

    const previousParams =
      historyState.forklyParams ||
      null;

    if (previousParams?.category) {
      setPendingCategory(
        previousParams.category
      );
    } else if (
      previousView === "restaurants"
    ) {
      setPendingCategory("all");
    }

    setView(previousView);
    setShowCart(false);
    setShowAuth(false);
    setShowNotifications(false);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  window.addEventListener(
    "popstate",
    handleBrowserNavigation
  );

  return () => {
    window.removeEventListener(
      "popstate",
      handleBrowserNavigation
    );
  };
}, []);
  const navigate = useCallback(
  (nextView, params) => {
    if (params?.category) {
      setPendingCategory(
        params.category
      );
    } else if (
      nextView === "restaurants"
    ) {
      setPendingCategory("all");
    }

    window.history.pushState(
      {
        ...(window.history.state ||
          {}),
        forklyPortal: "customer",
        forklyView: nextView,
        forklyParams:
          params || null,
      },
      "",
      window.location.href
    );

    setView(nextView);
    setShowCart(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
  []
);

const openRestaurant = useCallback(
  async (id) => {
    try {
      const restaurant = await getRestaurant(id);

      setSelectedRestaurantId(id);
      setSelectedRestaurant(restaurant);
      navigate("restaurant");
    } catch (error) {
      setRestaurantsError(error.message);
    }
  },
  [navigate]
);
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const doAddToCart = (restaurant, item, qty, addOns) => {
    const unitPrice = item.price + addOns.reduce((s, a) => s + a.price, 0);
    setCart((prev) => [...prev, {
      id: `${item.id}-${Date.now()}`, restaurantId: restaurant.id, restaurantName: restaurant.name,
      itemId: item.id, name: item.name, unitPrice, qty, addOns, img: item.img,
    }]);
  };

  const addToCart = (restaurant, item, qty, addOns) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
      setPendingAdd({ restaurant, item, qty, addOns });
      return;
    }
    doAddToCart(restaurant, item, qty, addOns);
  };

  const updateQty = (lineId, delta) => {
    setCart((prev) => prev.map((l) => (l.id === lineId ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  };
  const removeLine = (lineId) => setCart((prev) => prev.filter((l) => l.id !== lineId));

  const placeOrder = async ({ addressId, payMethod }) => {
  if (!cart.length) {
    throw new Error("Your cart is empty.");
  }

  const paymentMethod =
    payMethod === "card"
      ? "CARD"
      : payMethod === "upi"
        ? "UPI"
        : "CASH";

  const createdOrder = await createOrder({
    restaurantId: cart[0].restaurantId,
    addressId,
    paymentMethod,
    couponCode: couponCode || undefined,
    items: cart.map((line) => ({
      foodItemId: line.itemId,
      quantity: line.qty,
      addOnIds: (line.addOns || [])
        .map((addOn) => addOn.id)
        .filter(Boolean),
    })),
  });

  const orderForWebsite = {
    id: createdOrder.id,
    orderNumber: createdOrder.orderNumber,
    restaurantName:
      createdOrder.restaurant?.name ||
      cart[0].restaurantName,
    items: cart,
    totals: {
      subtotal: Number(createdOrder.subtotal),
      discount: Number(createdOrder.discount),
      deliveryFee: Number(createdOrder.deliveryFee),
      tax: Number(createdOrder.tax),
      total: Number(createdOrder.total),
    },
    addressId: createdOrder.addressId,
    payMethod: createdOrder.payment?.method || paymentMethod,
    dateLabel: new Date(
      createdOrder.createdAt
    ).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    status: createdOrder.status,
    stage: 0,
  };

  setOrders((current) => [
    ...current,
    orderForWebsite,
  ]);
  setActiveOrderId(orderForWebsite.id);
  setCart([]);
  setCouponCode(null);
  navigate("tracking");

  return orderForWebsite;
};

  const advanceStage = (orderId) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, stage: Math.min(o.stage + 1, ORDER_STAGES.length - 1) } : o)));
  };

  const refreshOrder = useCallback(
  async (orderId) => {
    const backendOrder = await getOrder(orderId);
    const updatedOrder =
      mapBackendOrder(backendOrder);

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? updatedOrder
          : order
      )
    );

    return updatedOrder;
  },
  []
);

  const reorder = (order) => {
    const rebuilt = order.items.map((l) => ({ ...l, id: `${l.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }));
    setCart(rebuilt);
    setShowCart(true);
  };

  const trackOrder = (orderId) => { setActiveOrderId(orderId); navigate("tracking"); };

 const handleAuth = (u) => {
  setCart([]);
  setCouponCode(null);
  setShowCart(false);

  setUser(u);
  setIsAuthed(true);
  setShowAuth(false);
};

const handleLogout = () => {
  setCart([]);
setCouponCode(null);
setShowCart(false);
setFavorites(new Set());
setOrders([]);
setActiveOrderId(null);
setNotifications([]);
setShowNotifications(false);
  localStorage.removeItem("forkly:accessToken");
  localStorage.removeItem("forkly:refreshToken");

  setCart([]);
  setCouponCode(null);
  setShowCart(false);

  setUser(null);
  setIsAuthed(false);
  navigate("home");
};
  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;
  const unreadCount =
  notifications.filter(
    (notification) =>
      !notification.isRead
  ).length;

if (initialLoading || restaurantsLoading) {    return (
      <div style={{ background: theme.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyles theme={theme} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UtensilsCrossed size={22} color="#fff" />
          </div>
          <Loader2 size={22} color={theme.primary} className="forkly-spin" />
        </div>
      </div>
    );
  }
  if (restaurantsError || restaurants.length === 0) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_STACK,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Unable to load restaurants</h2>
        <p style={{ color: theme.textMuted }}>
          {restaurantsError || "No restaurants are available."}
        </p>
        <PrimaryButton
          theme={theme}
          onClick={() => window.location.reload()}
        >
          Try again
        </PrimaryButton>
      </div>
    </div>
  );
}

  let page = null;
  if (view === "home") {
    page = <HomePage theme={theme} mode={mode} navigate={navigate} openRestaurant={openRestaurant} query={query} setQuery={setQuery} favorites={favorites} toggleFavorite={toggleFavorite} restaurants={restaurants} />;
  } else if (view === "offers") {
  page = (
    <OffersPage
      theme={theme}
      coupons={coupons}
      loading={couponsLoading}
      error={couponsError}
      navigate={navigate}
      openRestaurant={
        openRestaurant
      }
    />
  );
} else if (view === "categories") {
  page = (
    <CategoriesPage
      theme={theme}
      navigate={navigate}
      setQuery={setQuery}
    />
  );
} else if (view === "restaurants") {
    page = <RestaurantsPage theme={theme} navigate={navigate} openRestaurant={openRestaurant} query={query} setQuery={setQuery} favorites={favorites} toggleFavorite={toggleFavorite} initialCategory={pendingCategory} restaurants={restaurants} />;
  } else if (view === "restaurant" && selectedRestaurant) {
    page = <RestaurantDetailPage theme={theme} restaurant={selectedRestaurant} navigate={navigate} addToCart={addToCart} cart={cart} favorites={favorites} toggleFavorite={toggleFavorite} openCart={() => setShowCart(true)} />;
  } else if (view === "checkout") {
    page = <CheckoutPage theme={theme} cart={cart} couponCode={couponCode} navigate={navigate} placeOrder={placeOrder} />;
  } else if (view === "tracking") {
    page = <OrderTrackingPage theme={theme} order={activeOrder} navigate={navigate} refreshOrder={refreshOrder} />;
  } else if (view === "orders") {
    page = <OrderHistoryPage theme={theme} orders={orders} navigate={navigate} reorder={reorder} trackOrder={trackOrder} />;
  } else if (view === "favorites") {
    page = <FavoritesPage theme={theme} favorites={favorites} restaurants={restaurants} navigate={navigate} openRestaurant={openRestaurant} toggleFavorite={toggleFavorite} />;
  } else if (view === "profile") {
    page = <ProfilePage theme={theme} mode={mode} setMode={setMode} user={user} navigate={navigate} favCount={favorites.size} orderCount={orders.length} onLogout={handleLogout} onUserUpdated={setUser} />;
  } else {
    page = <NotFoundPage theme={theme} navigate={navigate} />;
  }

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="forkly-root" style={{ background: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: FONT_STACK, transition: "background .25s ease, color .25s ease" }}>
      <GlobalStyles theme={theme} />
      <Header
        theme={theme} mode={mode} setMode={setMode} view={view} navigate={navigate}
        cartCount={cartCount} favCount={favorites.size} isAuthed={isAuthed} user={user}
        onOpenCart={() => setShowCart(true)} onOpenAuth={() => setShowAuth(true)}
        onOpenNotifications={() => setShowNotifications((v) => !v)} unreadCount={unreadCount}
        celebrateDelivery={
  celebrateDelivery
}
        query={query} setQuery={setQuery}
      />

      <main key={view} className="forkly-page-enter">{page}</main>

      <Footer theme={theme} navigate={navigate} />
      <MobileBottomNav theme={theme} view={view} navigate={navigate} cartCount={cartCount} onOpenCart={() => setShowCart(true)} />

      {showCart && (
        <CartDrawer
          theme={theme} cart={cart} updateQty={updateQty} removeLine={removeLine}
          onClose={() => setShowCart(false)}
          onCheckout={() => { setShowCart(false); navigate("checkout"); }}
          couponCode={couponCode} setCouponCode={setCouponCode}
        />
      )}
      {showAuth && <AuthModal theme={theme} onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      {showNotifications && (
  <NotificationsPanel
    theme={theme}
    notifications={
      notifications
    }
    loading={
      notificationsLoading
    }
    error={
      notificationsError
    }
    onRead={
      handleNotificationRead
    }
    onReadAll={
      handleMarkAllNotificationsRead
    }
    onClose={() =>
      setShowNotifications(false)
    }
  />
)}
      {pendingAdd && (
        <ConfirmDialog
          theme={theme}
          title="Start a new cart?"
          desc={`Your cart has items from ${cart[0]?.restaurantName}. Adding from ${pendingAdd.restaurant.name} will clear it.`}
          confirmLabel="Start new cart"
          onCancel={() => setPendingAdd(null)}
          onConfirm={() => { setCart([]); doAddToCart(pendingAdd.restaurant, pendingAdd.item, pendingAdd.qty, pendingAdd.addOns); setPendingAdd(null); }}
        />
      )}
    </div>
  );
}

export default App;
