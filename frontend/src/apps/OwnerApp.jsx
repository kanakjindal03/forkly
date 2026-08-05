import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LayoutDashboard, Package, UtensilsCrossed, BarChart3, Tag, Settings, Bell, Search,
  ChevronDown, ChevronRight, Plus, Pencil, Trash2, Check, X, Clock, Star, TrendingUp,
  TrendingDown, DollarSign, Users, MapPin, Phone, ChefHat, Truck, CheckCircle2, XCircle,
  Sun, Moon, Menu as MenuIcon, LogOut, Image as ImageIcon, Percent, Calendar, MoreVertical,
  Store, ShoppingBag, AlertCircle, Loader2, UserCircle2, Flame, Leaf, ArrowRight, Copy,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  loginOwner,
  getSavedOwner,
  logoutOwner,
  getOwnerRestaurant,
  getOwnerOrders,
  updateOwnerOrderStatus,
  createOwnerFoodItem,
  updateOwnerFoodItem,
  deleteOwnerFoodItem,
  toggleOwnerFoodItemAvailability,
  clearOwnerSession,
  createOwnerMenuCategory,
  getOwnerAnalytics,
  updateOwnerRestaurant,
} from "../api/owner.js";
import PortalLogin from "../components/PortalLogin.jsx";
import RestaurantOwnerSignup from "../components/RestaurantOwnerSignup";

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* =========================================================================
   THEME TOKENS (shared brand language with the Forkly customer site)
   ========================================================================= */
const THEMES = {
  dark: {
    mode: "dark",
    bg: "#0B0F19", sidebar: "#0E1320", card: "#151A24", cardAlt: "#1A2130",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    primary: "#FF6B35", primaryHover: "#FF8555", primarySoft: "rgba(255,107,53,0.14)",
    accent: "#FFC857", accentSoft: "rgba(255,200,87,0.14)",
    success: "#22C55E", successSoft: "rgba(34,197,94,0.14)",
    error: "#EF4444", errorSoft: "rgba(239,68,68,0.14)",
    warning: "#F59E0B", warningSoft: "rgba(245,158,11,0.14)",
    text: "#FFFFFF", textMuted: "#9CA3AF", textFaint: "#6B7280",
    shadow: "0 20px 50px rgba(0,0,0,0.45)", shadowSoft: "0 8px 24px rgba(0,0,0,0.3)",
    overlay: "rgba(5,7,12,0.72)", chartGrid: "rgba(255,255,255,0.06)",
  },
  light: {
    mode: "light",
    bg: "#FBF8F3", sidebar: "#FFFFFF", card: "#FFFFFF", cardAlt: "#F6F1E8",
    border: "rgba(20,23,31,0.08)", borderStrong: "rgba(20,23,31,0.14)",
    primary: "#FF6B35", primaryHover: "#E85A2A", primarySoft: "rgba(255,107,53,0.10)",
    accent: "#E8A93D", accentSoft: "rgba(232,169,61,0.14)",
    success: "#16A34A", successSoft: "rgba(22,163,74,0.10)",
    error: "#DC2626", errorSoft: "rgba(220,38,38,0.10)",
    warning: "#D97706", warningSoft: "rgba(217,119,6,0.10)",
    text: "#14171F", textMuted: "#6B6558", textFaint: "#948C7D",
    shadow: "0 20px 50px rgba(30,24,10,0.10)", shadowSoft: "0 8px 24px rgba(30,24,10,0.06)",
    overlay: "rgba(20,16,8,0.5)", chartGrid: "rgba(20,23,31,0.06)",
  },
};

/* =========================================================================
   MOCK DATA
   ========================================================================= */
const IMG = {
  logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
  banner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&q=80",
  pizza2: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=300&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&q=80",
  pasta2: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
  dessert: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80",
  avatar1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  avatar2: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  avatar3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  avatar4: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
};

const RESTAURANT_PROFILE = {
  name: "Basil & Bloom", cuisine: "Italian", email: "hello@basilandbloom.com",
  phone: "+1 (555) 204-7788", address: "42 Cedar Lane, Downtown, Springfield",
  rating: 4.7, reviewCount: 238, logo: IMG.logo, banner: IMG.banner,
  hours: [
    { day: "Monday - Friday", open: "10:00 AM", close: "10:30 PM" },
    { day: "Saturday - Sunday", open: "11:00 AM", close: "11:30 PM" },
  ],
};

function FoodImg({ src, alt, style }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FF6B35,#FFC857)" }}><UtensilsCrossed size={18} color="#fff" /></div>;
  }
  return <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />;
}

const REVENUE_TREND = [
  { day: "Mon", revenue: 620 }, { day: "Tue", revenue: 740 }, { day: "Wed", revenue: 690 },
  { day: "Thu", revenue: 810 }, { day: "Fri", revenue: 1120 }, { day: "Sat", revenue: 1380 }, { day: "Sun", revenue: 1240 },
];

const MONTHLY_TREND = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(9000 + Math.sin(i / 2) * 3000 + i * 400),
}));

const TOP_ITEMS = [
  { name: "Margherita Supreme", sold: 312, revenue: 4053 },
  { name: "Truffle Alfredo", sold: 264, revenue: 3957 },
  { name: "Pepperoni Classic", sold: 241, revenue: 3372 },
  { name: "Truffle Mushroom", sold: 198, revenue: 3067 },
  { name: "Arrabbiata Penne", sold: 176, revenue: 2110 },
];

const CATEGORY_SPLIT = [
  { name: "Pizzas", value: 46 }, { name: "Pasta", value: 34 }, { name: "Sides", value: 12 }, { name: "Desserts", value: 8 },
];
const PIE_COLORS = ["#FF6B35", "#FFC857", "#22C55E", "#9CA3AF"];

const CUSTOMERS = [
  { name: "Priya Nair", avatar: IMG.avatar1 }, { name: "Marcus Bell", avatar: IMG.avatar2 },
  { name: "Alina Rossi", avatar: IMG.avatar3 }, { name: "James Ito", avatar: IMG.avatar4 },
];

function mkOrder(id, customer, items, total, status, minutesAgo, address) {
  return { id, customer, items, total, status, minutesAgo, address };
}

const INITIAL_ORDERS = [
  mkOrder("F-3081", CUSTOMERS[0], [{ name: "Margherita Supreme", qty: 1 }, { name: "Pesto Linguine", qty: 1 }], 27.48, "incoming", 1, "221B Baker Street, Apt 4"),
  mkOrder("F-3080", CUSTOMERS[1], [{ name: "Truffle Mushroom", qty: 2 }], 30.98, "incoming", 3, "500 Market Square, Floor 9"),
  mkOrder("F-3079", CUSTOMERS[2], [{ name: "Pepperoni Classic", qty: 1 }, { name: "Garlic Naan", qty: 2 }], 20.97, "preparing", 8, "14 Willow Court"),
  mkOrder("F-3078", CUSTOMERS[3], [{ name: "Arrabbiata Penne", qty: 1 }], 11.99, "preparing", 12, "9 Harbor Walk"),
  mkOrder("F-3077", CUSTOMERS[0], [{ name: "Truffle Alfredo", qty: 1 }, { name: "Pesto Linguine", qty: 1 }], 27.48, "ready", 18, "221B Baker Street, Apt 4"),
  mkOrder("F-3076", CUSTOMERS[1], [{ name: "Margherita Supreme", qty: 2 }], 25.98, "completed", 55, "500 Market Square, Floor 9"),
  mkOrder("F-3075", CUSTOMERS[2], [{ name: "Pepperoni Classic", qty: 1 }], 13.99, "completed", 80, "14 Willow Court"),
  mkOrder("F-3074", CUSTOMERS[3], [{ name: "Truffle Mushroom", qty: 1 }], 15.49, "cancelled", 120, "9 Harbor Walk"),
];

const INITIAL_MENU = [
  { name: "Pizzas", items: [
    { id: "bb-1", name: "Margherita Supreme", price: 12.99, desc: "San Marzano tomato, buffalo mozzarella, basil", img: IMG.pizza, veg: true, available: true },
    { id: "bb-2", name: "Truffle Mushroom", price: 15.49, desc: "Wild mushroom, truffle oil, fontina, thyme", img: IMG.pizza2, veg: true, available: true },
    { id: "bb-3", name: "Pepperoni Classic", price: 13.99, desc: "Double pepperoni, mozzarella, chili honey", img: IMG.pizza2, veg: false, available: true },
  ]},
  { name: "Pasta", items: [
    { id: "bb-4", name: "Truffle Alfredo", price: 14.99, desc: "Fettuccine, cream, parmesan, black truffle", img: IMG.pasta, veg: true, available: true },
    { id: "bb-5", name: "Arrabbiata Penne", price: 11.99, desc: "Spicy tomato, garlic, chili, pecorino", img: IMG.pasta2, veg: true, available: false },
    { id: "bb-6", name: "Pesto Linguine", price: 12.49, desc: "Basil pesto, pine nuts, cherry tomato", img: IMG.pasta, veg: true, available: true },
  ]},
  { name: "Desserts", items: [
    { id: "bb-7", name: "Tiramisu", price: 6.99, desc: "Espresso-soaked sponge, mascarpone cream", img: IMG.dessert, veg: true, available: true },
  ]},
];

const INITIAL_COUPONS = [
  { id: "c1", code: "FORK20", desc: "20% off, up to $6", type: "percent", value: 20, active: true, uses: 412 },
  { id: "c2", code: "FREESHIP", desc: "Free delivery on orders over $25", type: "shipping", value: 0, active: true, uses: 198 },
  { id: "c3", code: "WELCOME10", desc: "10% off first order", type: "percent", value: 10, active: false, uses: 856 },
];

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
function StatCard({ theme, label, value, delta, deltaPositive, icon: Icon, accent }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 20, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: accent || theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={theme.primary} />
        </div>
        {delta && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: deltaPositive ? theme.success : theme.error }}>
            {deltaPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function Chip({ children, active, onClick, theme, count }) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 16px", borderRadius: 12, fontSize: 13.5, fontWeight: 700, fontFamily: FONT_STACK,
      border: `1px solid ${active ? theme.primary : theme.border}`, background: active ? theme.primary : "transparent",
      color: active ? "#fff" : theme.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
    }}>
      {children}
      {count != null && (
        <span style={{ background: active ? "rgba(255,255,255,0.25)" : theme.primarySoft, color: active ? "#fff" : theme.primary, borderRadius: 999, padding: "1px 7px", fontSize: 11 }}>{count}</span>
      )}
    </button>
  );
}

function PrimaryButton({ children, onClick, theme, full, size = "md", icon, variant = "solid" }) {
  const pad = size === "sm" ? "9px 14px" : "12px 20px";
  const fontSize = size === "sm" ? 12.5 : 13.5;
  const styles = variant === "solid"
    ? { background: theme.primary, color: "#fff", border: "none" }
    : variant === "outline"
      ? { background: "transparent", color: theme.text, border: `1px solid ${theme.border}` }
      : { background: theme.errorSoft, color: theme.error, border: "none" };
  return (
    <button onClick={onClick} style={{
      padding: pad, fontSize, fontWeight: 700, borderRadius: 12, width: full ? "100%" : "auto", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: FONT_STACK, ...styles,
    }}>
      {icon}{children}
    </button>
  );
}

function Toggle({ on, onClick, theme }) {
  return (
    <button onClick={onClick} style={{
      width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
      background: on ? theme.success : theme.border, transition: "background .2s ease",
    }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
    </button>
  );
}

function CustomTooltip({ active, payload, label, theme, prefix = "$" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px", boxShadow: theme.shadowSoft }}>
      <div style={{ fontSize: 11.5, color: theme.textMuted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{prefix}{payload[0].value.toLocaleString()}</div>
    </div>
  );
}

/* =========================================================================
   SIDEBAR + TOPBAR SHELL
   ========================================================================= */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ theme, view, setView, mobileOpen, setMobileOpen, onSignOut, restaurant, }) {
  return (
    <>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="owner-sidebar-scrim" style={{ position: "fixed", inset: 0, background: theme.overlay, zIndex: 55, display: "none" }} />}
      <aside className={`owner-sidebar ${mobileOpen ? "owner-sidebar-open" : ""}`} style={{
        width: 240, flexShrink: 0, background: theme.sidebar, borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column", padding: "22px 16px", height: "100vh", position: "sticky", top: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 30 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <UtensilsCrossed size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.4 }}>Forkly</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.3 }}>FOR RESTAURANTS</div>
          </div>
          <button className="owner-sidebar-close" onClick={() => setMobileOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "none" }}><X size={18} /></button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_ITEMS.map((n) => {
            const Ico = n.icon;
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => { setView(n.id); setMobileOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 11, border: "none",
                background: active ? theme.primarySoft : "transparent", color: active ? theme.primary : theme.textMuted,
                fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: FONT_STACK, textAlign: "left",
              }}>
                <Ico size={17} /> {n.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", background: theme.cardAlt, borderRadius: 14, padding: 14, border: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FoodImg src={RESTAURANT_PROFILE.logo} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{restaurant?.name || "Your restaurant"}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Star size={11} color={theme.accent} fill={theme.accent} /> {Number(
  restaurant?.avgRating ??
  restaurant?.rating ??
  0
).toFixed(1)}</div>
            </div>
          </div>
        </div>
        <button
  type="button"
  onClick={onSignOut}
  style={{
    width: "100%",
    marginTop: 10,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: theme.error,
    background: theme.errorSoft,
    border: "none",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  <LogOut size={15} />
  Sign out
</button>
      </aside>
    </>
  );
}

function Topbar({ theme, mode, setMode, title, subtitle, setMobileOpen }) {
  const [showNotif, setShowNotif] = useState(false);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20, background: theme.mode === "dark" ? "rgba(11,15,25,0.85)" : "rgba(251,248,243,0.85)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, padding: "16px 26px",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <button className="owner-menu-btn" onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "none", color: theme.text, cursor: "pointer" }}><MenuIcon size={22} /></button>
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1 }} />
      <div className="owner-topbar-search" style={{ display: "flex", alignItems: "center", gap: 8, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 11, padding: "8px 12px", width: 220 }}>
        <Search size={15} color={theme.textMuted} />
        <input placeholder="Search orders, items…" style={{ border: "none", outline: "none", background: "transparent", color: theme.text, fontSize: 13, width: "100%", fontFamily: FONT_STACK }} />
      </div>
      <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ width: 38, height: 38, borderRadius: 11, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {mode === "dark" ? <Sun size={16} color={theme.text} /> : <Moon size={16} color={theme.text} />}
      </button>
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowNotif((v) => !v)} style={{ width: 38, height: 38, borderRadius: 11, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={16} color={theme.text} />
          <span style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: theme.primary }} />
        </button>
        {showNotif && (
          <div style={{ position: "absolute", top: 46, right: 0, width: 280, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, boxShadow: theme.shadow, padding: 8, zIndex: 30 }}>
            {[
              { t: "New order received", d: "Order #F-3081 · 1 min ago" },
              { t: "Low stock warning", d: "Arrabbiata Penne is running low" },
              { t: "New 5-star review", d: "From Priya Nair · 2 hrs ago" },
            ].map((n) => (
              <div key={n.t} style={{ padding: "10px 10px", borderRadius: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.t}</div>
                <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{n.d}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>B</div>
    </header>
  );
}

/* =========================================================================
   DASHBOARD OVERVIEW PAGE
   ========================================================================= */
const STATUS_META = {
  active: {
    label: "Active",
    color: "primary",
  },

  incoming: {
    label: "New order",
    color: "warning",
  },

  accepted: {
    label: "Accepted",
    color: "primary",
  },

  preparing: {
    label: "Preparing",
    color: "primary",
  },

  ready: {
    label: "Ready",
    color: "accent",
  },

  picked_up: {
    label: "Picked up",
    color: "accent",
  },

  on_the_way: {
    label: "On the way",
    color: "primary",
  },

  completed: {
    label: "Delivered",
    color: "success",
  },

  cancelled: {
    label: "Cancelled",
    color: "error",
  },
};

function StatusBadge({ status, theme }) {
  const meta = STATUS_META[status];
  const colorMap = { warning: theme.warning, primary: theme.primary, accent: theme.mode === "dark" ? theme.accent : "#8A6414", success: theme.success, error: theme.error };
  const softMap = { warning: theme.warningSoft, primary: theme.primarySoft, accent: theme.accentSoft, success: theme.successSoft, error: theme.errorSoft };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: softMap[meta.color], color: colorMap[meta.color], whiteSpace: "nowrap" }}>
      {meta.label}
    </span>
  );
}

function DashboardPage({ theme, orders, setView }) {
  const now = new Date();

const deliveredOrders = orders.filter(
  (order) => order.status === "completed"
);

const todayOrders = orders.filter((order) => {
  const orderDate = new Date(order.createdAt);

  return (
    orderDate.getDate() === now.getDate() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getFullYear() === now.getFullYear()
  );
});

const todayRevenue = todayOrders
  .filter((order) => order.status === "completed")
  .reduce(
    (total, order) => total + order.total,
    0
  );

const monthlyRevenue = deliveredOrders
  .filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() ===
        now.getFullYear()
    );
  })
  .reduce(
    (total, order) => total + order.total,
    0
  );

  const yearlyRevenue = deliveredOrders
  .filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getFullYear() ===
      now.getFullYear()
    );
  })
  .reduce(
    (total, order) => total + order.total,
    0
  );

const avgOrderValue =
  deliveredOrders.length > 0
    ? deliveredOrders.reduce(
        (total, order) => total + order.total,
        0
      ) / deliveredOrders.length
    : 0;

    const weeklyRevenue = Array.from(
  { length: 7 },
  (_, index) => {
    const date = new Date(now);

    date.setHours(0, 0, 0, 0);
    date.setDate(
      now.getDate() - (6 - index)
    );

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const revenue = deliveredOrders
      .filter((order) => {
        const orderDate = new Date(
          order.createdAt
        );

        return (
          orderDate >= date &&
          orderDate < nextDate
        );
      })
      .reduce(
        (total, order) =>
          total + order.total,
        0
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      revenue,
    };
  }
);

  return (
    <div style={{ padding: "26px" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <StatCard
  theme={theme}
  label="Today's revenue"
  value={`$${todayRevenue.toFixed(2)}`}
  icon={DollarSign}
/>

<StatCard
  theme={theme}
  label="Today's orders"
  value={todayOrders.length}
  icon={Package}
/>

<StatCard
  theme={theme}
  label="Monthly revenue"
  value={`$${monthlyRevenue.toFixed(2)}`}
  icon={TrendingUp}
/>

<StatCard
  theme={theme}
  label="Yearly revenue"
  value={`$${yearlyRevenue.toFixed(2)}`}
  icon={BarChart3}
/>
<StatCard
  theme={theme}
  label="Avg. order value"
  value={`$${avgOrderValue.toFixed(2)}`}
  icon={ShoppingBag}
/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }} className="owner-dash-grid">
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Revenue this week</div>
            <span style={{ fontSize: 12, color: theme.textMuted }}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={weeklyRevenue}>
              <defs>
                <linearGradient id="ownerRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Area type="monotone" dataKey="revenue" stroke={theme.primary} strokeWidth={2.5} fill="url(#ownerRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Popular categories</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                {CATEGORY_SPLIT.map((c, i) => <Cell key={c.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip theme={theme} prefix="" />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            {CATEGORY_SPLIT.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span style={{ color: theme.textMuted, flex: 1 }}>{c.name}</span>
                <span style={{ fontWeight: 700 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Recent orders</div>
          <button onClick={() => setView("orders")} style={{ background: "none", border: "none", color: theme.primary, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_STACK }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                <th style={{ padding: "0 10px 12px 0", fontWeight: 600 }}>Order</th>
                <th style={{ padding: "0 10px 12px", fontWeight: 600 }}>Customer</th>
                <th style={{ padding: "0 10px 12px", fontWeight: 600 }}>Items</th>
                <th style={{ padding: "0 10px 12px", fontWeight: 600 }}>Total</th>
                <th style={{ padding: "0 0 12px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 10px 12px 0", fontWeight: 700 }}>#{o.id}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={o.customer.avatar} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                      {o.customer.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", color: theme.textMuted }}>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                  <td style={{ padding: "12px 0" }}><StatusBadge status={o.status} theme={theme} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ORDERS PAGE
   ========================================================================= */
const ORDER_TABS = [
  "active",
  "incoming",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

const ACTIVE_ORDER_STATUSES = [
  "incoming",
  "accepted",
  "preparing",
  "ready",
  "picked_up",
  "on_the_way",
];

function matchesOwnerOrderTab(
  order,
  tab
) {
  if (tab === "active") {
    return ACTIVE_ORDER_STATUSES.includes(
      order.status
    );
  }

  if (tab === "preparing") {
    return [
      "accepted",
      "preparing",
    ].includes(order.status);
  }

  return order.status === tab;
}
function OrderCard({ order, theme, onAdvance, onReject }) {
  const nextAction = {
  PENDING: {
    label: "Accept order",
    next: "ACCEPTED",
    icon: Check,
  },

  ACCEPTED: {
    label: "Start preparing",
    next: "PREPARING",
    icon: Flame,
  },

  PREPARING: {
    label: "Mark ready",
    next: "READY",
    icon: ChefHat,
  },
}[order.backendStatus];

  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={order.customer.avatar} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{order.customer.name}</div>
            <div style={{ fontSize: 11.5, color: theme.textMuted }}>#{order.id} · {order.minutesAgo} min ago</div>
          </div>
        </div>
        <StatusBadge status={order.status} theme={theme} />
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 4 }}>
        {order.items.map((it) => (
          <div key={it.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: theme.textMuted }}>
            <span>{it.qty}× {it.name}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: theme.textFaint }}>
        <MapPin size={12} /> {order.address}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>${order.total.toFixed(2)}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {order.status === "incoming" && (
            <button onClick={() => onReject(order.id)} style={{ background: theme.errorSoft, color: theme.error, border: "none", borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT_STACK }}>
              Reject
            </button>
          )}
          {nextAction && (
            <button onClick={() => onAdvance(order.id, nextAction.next)} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_STACK }}>
              <nextAction.icon size={13} /> {nextAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersPage({ theme, orders, onAdvance, onReject }) {
  const [tab, setTab] =
  useState("active");

const filtered = orders.filter(
  (order) =>
    matchesOwnerOrderTab(order, tab)
);

  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, overflowX: "auto" }}>
        {ORDER_TABS.map((t) => (
          <Chip key={t} theme={theme} active={tab === t} onClick={() => setTab(t)} count={
  orders.filter((order) =>
    matchesOwnerOrderTab(order, t)
  ).length
}>
            {STATUS_META[t].label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: theme.textMuted }}>
          <Package size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>No {STATUS_META[tab].label.toLowerCase()} orders</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="owner-orders-grid">
          {filtered.map((o) => <OrderCard key={o.id} order={o} theme={theme} onAdvance={onAdvance} onReject={onReject} />)}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   MENU MANAGEMENT PAGE
   ========================================================================= */
function ItemFormModal({ theme, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [veg, setVeg] = useState(initial?.veg ?? true);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 420, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{initial ? "Edit item" : "Add new item"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{
          height: 110, borderRadius: 14, background: theme.cardAlt, border: `1.5px dashed ${theme.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16, cursor: "pointer",
        }}>
          <ImageIcon size={22} color={theme.textMuted} />
          <span style={{ fontSize: 12, color: theme.textMuted }}>Upload food photo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Item name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Margherita Supreme" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Price ($)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12.99" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Diet</label>
              <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                {[{ v: true, l: "Veg" }, { v: false, l: "Non-veg" }].map((o) => (
                  <button key={o.l} onClick={() => setVeg(o.v)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT_STACK,
                    border: `1px solid ${veg === o.v ? theme.primary : theme.border}`, background: veg === o.v ? theme.primarySoft : theme.card, color: veg === o.v ? theme.primary : theme.text,
                  }}>{o.l}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Short description of the dish" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK, resize: "vertical" }} />
          </div>
          <PrimaryButton theme={theme} full size="md" onClick={() => onSave({ name, price: parseFloat(price) || 0, desc, veg })}>
            {initial ? "Save changes" : "Add item"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function MenuPage({
  theme,
  menu,
  onToggleAvailability,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onAddCategory,
}) {
  const [modal, setModal] = useState(null); // { categoryName, item? }
  const [showCategoryForm, setShowCategoryForm] = useState(false);
const [categoryName, setCategoryName] = useState("");
const [creatingCategory, setCreatingCategory] = useState(false);
const [categoryError, setCategoryError] = useState("");

const handleCreateCategory = async () => {
  const name = categoryName.trim();

  if (!name) {
    setCategoryError("Please enter a category name");
    return;
  }

  try {
    setCreatingCategory(true);
    setCategoryError("");

    await onAddCategory(name);

    setCategoryName("");
    setShowCategoryForm(false);
  } catch (error) {
    setCategoryError(error.message || "Unable to create category");
  } finally {
    setCreatingCategory(false);
  }
};
  return (
    <div style={{ padding: 26 }}>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  }}
>
  <div style={{ color: theme.textMuted, fontSize: 13.5 }}>
    {menu.reduce(
      (total, category) =>
        total + category.items.length,
      0
    )}{" "}
    items across {menu.length} categories
  </div>

  <div style={{ display: "flex", gap: 8 }}>
    <PrimaryButton
      theme={theme}
      size="sm"
      variant="outline"
      icon={<Plus size={14} />}
      onClick={() => {
        setCategoryError("");
        setShowCategoryForm(true);
      }}
    >
      Add category
    </PrimaryButton>

    <PrimaryButton
      theme={theme}
      size="sm"
      icon={<Plus size={14} />}
      disabled={menu.length === 0}
      onClick={() =>
        setModal({
          categoryName: menu[0]?.name || "",
        })
      }
    >
      Add item
    </PrimaryButton>
  </div>
</div>
{showCategoryForm && (
  <div
    style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      padding: 16,
      marginBottom: 22,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        fontSize: 14,
        marginBottom: 10,
      }}
    >
      Create menu category
    </div>

    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        autoFocus
        value={categoryName}
        placeholder="For example: Starters, Pizza or Desserts"
        onChange={(event) => {
          setCategoryName(event.target.value);
          setCategoryError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleCreateCategory();
          }
        }}
        style={{
          flex: 1,
          minWidth: 220,
          padding: "11px 13px",
          borderRadius: 9,
          border: `1px solid ${theme.border}`,
          background: theme.input || theme.bg,
          color: theme.text,
          fontFamily: "inherit",
        }}
      />

      <button
        type="button"
        onClick={() => {
          setShowCategoryForm(false);
          setCategoryName("");
          setCategoryError("");
        }}
        style={{
          padding: "10px 15px",
          borderRadius: 9,
          border: `1px solid ${theme.border}`,
          background: "transparent",
          color: theme.text,
          cursor: "pointer",
        }}
      >
        Cancel
      </button>

      <PrimaryButton
        theme={theme}
        size="sm"
        disabled={creatingCategory}
        onClick={handleCreateCategory}
      >
        {creatingCategory ? "Creating..." : "Create category"}
      </PrimaryButton>
    </div>

    {categoryError && (
      <div
        style={{
          color: theme.danger || "#ef4444",
          fontSize: 12,
          marginTop: 8,
        }}
      >
        {categoryError}
      </div>
    )}
  </div>
)}

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {menu.map((cat) => (
          <div key={cat.name}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{cat.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="owner-menu-grid">
              {cat.items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 12, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 14, opacity: item.available ? 1 : 0.6 }}>
                  <FoodImg src={item.img} alt={item.name} style={{ width: 68, height: 68, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5 }}>{item.name}</span>
                      <span style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap" }}>${item.price.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Toggle on={item.available} onClick={() => onToggleAvailability(cat.name, item.id)} theme={theme} />
                        <span style={{ fontSize: 11, color: theme.textMuted }}>{item.available ? "Available" : "86'd"}</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setModal({ categoryName: cat.name, item })} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: theme.cardAlt, color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Pencil size={13} /></button>
                        <button onClick={() => onDeleteItem(cat.name, item.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: theme.errorSoft, color: theme.error, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ItemFormModal
          theme={theme} initial={modal.item}
          onClose={() => setModal(null)}
          onSave={(data) => { modal.item ? onEditItem(modal.categoryName, modal.item.id, data) : onAddItem(modal.categoryName, data); setModal(null); }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   ANALYTICS PAGE
   ========================================================================= */
function AnalyticsPage({
  theme,
  analytics,
}) {
  const monthlyRevenue =
    analytics?.monthlyRevenue || [];

  const topItems =
    analytics?.topItems || [];

  const categoryMix =
    analytics?.categoryMix || [];
  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Revenue trend</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 18 }}>Monthly revenue over the past year</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Line type="monotone" dataKey="revenue" stroke={theme.primary} strokeWidth={2.5} dot={{ r: 3, fill: theme.primary }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }} className="owner-dash-grid">
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Top selling items</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
                <XAxis type="number" tick={{ fill: theme.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: theme.textMuted, fontSize: 11.5 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip theme={theme} prefix="" />} />
                <Bar dataKey="sold" fill={theme.primary} radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Category mix</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryMix} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                  {categoryMix.map((c, i) => <Cell key={c.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip theme={theme} prefix="" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Best performing dishes</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                  <th style={{ padding: "0 10px 12px 0", fontWeight: 600 }}>Item</th>
                  <th style={{ padding: "0 10px 12px", fontWeight: 600 }}>Units sold</th>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((it) => (
                  <tr key={it.name} style={{ borderTop: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "12px 10px 12px 0", fontWeight: 700 }}>{it.name}</td>
                    <td style={{ padding: "12px 10px", color: theme.textMuted }}>{it.sold}</td>
                    <td style={{ padding: "12px 0", fontWeight: 700 }}>${it.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COUPONS PAGE
   ========================================================================= */
function CouponFormModal({ theme, onClose, onSave }) {
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 400, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>New discount campaign</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Coupon code</label>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SPRING15" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. 15% off orders over $20" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }}>
                <option value="percent">% discount</option>
                <option value="shipping">Free delivery</option>
              </select>
            </div>
            {type === "percent" && (
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>Value (%)</label>
                <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="15" style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
              </div>
            )}
          </div>
          <PrimaryButton theme={theme} full onClick={() => onSave({ code, desc, type, value: parseFloat(value) || 0 })}>Create campaign</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function CouponsPage({ theme, coupons, onToggle, onCreate }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: theme.textMuted, fontSize: 13.5 }}>{coupons.filter((c) => c.active).length} active campaigns</div>
        <PrimaryButton theme={theme} size="sm" icon={<Plus size={14} />} onClick={() => setShowModal(true)}>New campaign</PrimaryButton>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {coupons.map((c) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18, opacity: c.active ? 1 : 0.55 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.type === "percent" ? <Percent size={19} color={theme.primary} /> : <Truck size={19} color={theme.primary} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 14.5, letterSpacing: 0.3 }}>{c.code}</span>
                <button style={{ background: "none", border: "none", color: theme.textFaint, cursor: "pointer", display: "flex" }}><Copy size={13} /></button>
              </div>
              <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>{c.desc}</div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{c.uses}</div>
              <div style={{ fontSize: 10.5, color: theme.textMuted }}>Redemptions</div>
            </div>
            <Toggle on={c.active} onClick={() => onToggle(c.id)} theme={theme} />
          </div>
        ))}
      </div>
      {showModal && (
        <CouponFormModal theme={theme} onClose={() => setShowModal(false)} onSave={(data) => { onCreate(data); setShowModal(false); }} />
      )}
    </div>
  );
}
const DEFAULT_OPENING_HOURS = [
  {
    day: "Monday",
    open: "10:00",
    close: "22:00",
  },
  {
    day: "Tuesday",
    open: "10:00",
    close: "22:00",
  },
  {
    day: "Wednesday",
    open: "10:00",
    close: "22:00",
  },
  {
    day: "Thursday",
    open: "10:00",
    close: "22:00",
  },
  {
    day: "Friday",
    open: "10:00",
    close: "23:00",
  },
  {
    day: "Saturday",
    open: "10:00",
    close: "23:00",
  },
  {
    day: "Sunday",
    open: "10:00",
    close: "22:00",
  },
];
/* =========================================================================
   SETTINGS PAGE
   ========================================================================= */
function SettingsPage({
  theme,
  profile,
  onSave,
}) {
  const [name, setName] =
    useState(profile?.name || "");

  const [phone, setPhone] =
    useState(profile?.phone || "");

  const [email, setEmail] =
    useState(profile?.email || "");

  const [address, setAddress] =
    useState(
      profile?.addressLine ||
        profile?.address ||
        ""
    );

  const [city, setCity] =
    useState(profile?.city || "");
    const [logoUrl, setLogoUrl] =
  useState(
    profile?.logoUrl || ""
  );

const [bannerUrl, setBannerUrl] =
  useState(
    profile?.bannerUrl || ""
  );

const [
  showImageEditor,
  setShowImageEditor,
] = useState(false);

    const [hours, setHours] =
  useState(
    Array.isArray(
      profile?.openingHours
    ) &&
      profile.openingHours.length > 0
      ? profile.openingHours
      : DEFAULT_OPENING_HOURS
  );

  const [saved, setSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  useEffect(() => {
    if (!profile) return;

    setName(profile.name || "");
    setPhone(profile.phone || "");
    setEmail(profile.email || "");
    setAddress(
      profile.addressLine ||
        profile.address ||
        ""
    );
    setCity(profile.city || "");
    setLogoUrl(
  profile.logoUrl || ""
);

setBannerUrl(
  profile.bannerUrl || ""
);
    setHours(
  Array.isArray(
    profile.openingHours
  ) &&
    profile.openingHours.length > 0
    ? profile.openingHours
    : DEFAULT_OPENING_HOURS
);
  }, [profile]);

  const handleSaveSettings =
    async () => {
      try {
        setSaving(true);
        setSaved(false);
        setSaveError("");

        await onSave({
          name: name.trim(),
          phone:
            phone.trim() || undefined,
          email:
            email.trim() || undefined,
          addressLine:
            address.trim(),
          city: city.trim(),
          openingHours: hours,
          logoUrl:
  logoUrl.trim() || undefined,

bannerUrl:
  bannerUrl.trim() || undefined,
        });

        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 1800);
      } catch (error) {
        setSaveError(
          error.message ||
            "Unable to save restaurant details"
        );
      } finally {
        setSaving(false);
      }
    };

  const field = (label, value, setValue) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} style={{ width: "100%", marginTop: 5, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "11px 12px", color: theme.text, fontSize: 13.5, outline: "none", fontFamily: FONT_STACK }} />
    </div>
  );

  return (
    <div style={{ padding: 26, maxWidth: 720 }}>
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", height: 150, marginBottom: -34 }}>
        <FoodImg src={
  bannerUrl || IMG.banner
}alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.4))" }} />
        <button type="button"
onClick={() =>
  setShowImageEditor(true)
} style={{ position: "absolute", top: 12, right: 12, background: "rgba(11,15,25,0.6)", border: "none", borderRadius: 10, padding: "7px 12px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_STACK }}>
          <ImageIcon size={13} /> Change banner
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <FoodImg src={
  logoUrl || IMG.logo
} alt="" style={{ width: 76, height: 76, borderRadius: 18, objectFit: "cover", border: `4px solid ${theme.bg}` }} />
          <button  type="button"
onClick={() =>
  setShowImageEditor(true)
}style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: theme.primary, border: `2px solid ${theme.bg}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Pencil size={11} color="#fff" />
          </button>
        </div>
      </div>
      {showImageEditor && (
  <div
    style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 18,
      padding: 22,
      marginBottom: 18,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Restaurant images
        </div>

        <div
          style={{
            color: theme.textMuted,
            fontSize: 12,
            marginTop: 3,
          }}
        >
          Paste publicly accessible
          image URLs.
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowImageEditor(false)
        }
        style={{
          border: "none",
          background: "transparent",
          color: theme.textMuted,
          cursor: "pointer",
        }}
      >
        <X size={18} />
      </button>
    </div>

    <div>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: theme.textMuted,
        }}
      >
        Logo image URL
      </label>

      <input
        type="url"
        value={logoUrl}
        placeholder="https://example.com/restaurant-logo.jpg"
        onChange={(event) =>
          setLogoUrl(
            event.target.value
          )
        }
        style={{
          width: "100%",
          marginTop: 5,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: "11px 12px",
          color: theme.text,
          fontSize: 13.5,
          fontFamily: FONT_STACK,
        }}
      />
    </div>

    <div>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: theme.textMuted,
        }}
      >
        Banner image URL
      </label>

      <input
        type="url"
        value={bannerUrl}
        placeholder="https://example.com/restaurant-banner.jpg"
        onChange={(event) =>
          setBannerUrl(
            event.target.value
          )
        }
        style={{
          width: "100%",
          marginTop: 5,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 10,
          padding: "11px 12px",
          color: theme.text,
          fontSize: 13.5,
          fontFamily: FONT_STACK,
        }}
      />
    </div>

    <PrimaryButton
      theme={theme}
      onClick={handleSaveSettings}
      disabled={saving}
    >
      {saving
        ? "Saving..."
        : saved
          ? "Images saved"
          : "Save images"}
    </PrimaryButton>

    {saveError && (
      <div
        style={{
          color:
            theme.danger ||
            "#ef4444",
          fontSize: 12,
        }}
      >
        {saveError}
      </div>
    )}
  </div>
)}

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Restaurant information</div>
        {field("Restaurant name", name, setName)}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>{field("Phone", phone, setPhone)}</div>
          <div style={{ flex: 1 }}>{field("Email", email, setEmail)}</div>
        </div>
        {field("Address", address, setAddress)}
        {field("City", city, setCity)}
        <PrimaryButton
  theme={theme}
  onClick={handleSaveSettings}
  disabled={saving}
  icon={
    saved
      ? <Check size={14} />
      : null
  }
>
  {saving
    ? "Saving..."
    : saved
      ? "Saved"
      : "Save changes"}
</PrimaryButton>
      </div>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, marginTop: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Opening hours</div>
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
  }}
>
  {hours.map((hour, index) => (
    <div
      key={hour.day}
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: 14,
        padding: "10px 0",
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <span
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          minWidth: 100,
        }}
      >
        {hour.day}
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          type="time"
          value={hour.open}
          onChange={(event) => {
            const newValue =
              event.target.value;

            setHours(
              (currentHours) =>
                currentHours.map(
                  (
                    currentHour,
                    currentIndex
                  ) =>
                    currentIndex ===
                    index
                      ? {
                          ...currentHour,
                          open: newValue,
                        }
                      : currentHour
                )
            );
          }}
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: "8px 10px",
            background: theme.card,
            color: theme.text,
            fontFamily: FONT_STACK,
          }}
        />

        <span
          style={{
            color: theme.textMuted,
            fontSize: 12,
          }}
        >
          to
        </span>

        <input
          type="time"
          value={hour.close}
          onChange={(event) => {
            const newValue =
              event.target.value;

            setHours(
              (currentHours) =>
                currentHours.map(
                  (
                    currentHour,
                    currentIndex
                  ) =>
                    currentIndex ===
                    index
                      ? {
                          ...currentHour,
                          close: newValue,
                        }
                      : currentHour
                )
            );
          }}
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: "8px 10px",
            background: theme.card,
            color: theme.text,
            fontFamily: FONT_STACK,
          }}
        />
      </div>
    </div>
  ))}

  <PrimaryButton
    theme={theme}
    onClick={handleSaveSettings}
    disabled={saving}
  >
    {saving
      ? "Saving..."
      : "Save opening hours"}
  </PrimaryButton>
</div>
      </div>
    </div>
  );
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; }
      button { font-family: inherit; }
      input:focus, select:focus, textarea:focus, button:focus-visible { outline: 2px solid ${theme.primary}; outline-offset: 1px; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 8px; }
      @keyframes owner-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .owner-page-enter { animation: owner-fade .3s ease; }

      @media (max-width: 1080px) {
        .owner-dash-grid { grid-template-columns: 1fr !important; }
        .owner-orders-grid { grid-template-columns: repeat(2,1fr) !important; }
      }
      @media (max-width: 860px) {
        .owner-sidebar { position: fixed !important; left: -260px; top: 0; z-index: 60; transition: left .25s ease; box-shadow: 0 0 0 transparent; }
        .owner-sidebar-open { left: 0 !important; box-shadow: 20px 0 50px rgba(0,0,0,0.3); }
        .owner-sidebar-scrim { display: block !important; }
        .owner-sidebar-close { display: flex !important; }
        .owner-menu-btn { display: flex !important; }
        .owner-topbar-search { display: none !important; }
        .owner-menu-grid { grid-template-columns: 1fr !important; }
        .owner-orders-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

function mapBackendOwnerOrder(order) {
  const statusMap = {
  PENDING: "incoming",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  PICKED_UP: "picked_up",
  ON_THE_WAY: "on_the_way",
  DELIVERED: "completed",
  CANCELLED: "cancelled",
};

  const createdTime = new Date(
    order.createdAt
  ).getTime();

  const minutesAgo = Math.max(
    0,
    Math.floor(
      (Date.now() - createdTime) / 60000
    )
  );

  const addressParts = [
    order.address?.line1,
    order.address?.line2,
    order.address?.city,
    order.address?.state,
    order.address?.postalCode,
  ].filter(Boolean);

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    backendStatus: order.status,
    status:
      statusMap[order.status] || "incoming",
    customer: {
      name: order.user?.name || "Customer",
      email: order.user?.email || "",
      avatar:
        order.user?.avatarUrl || IMG.avatar1,
    },
    items: (order.items || []).map(
      (item) => ({
        id: item.id,
        name: item.nameSnapshot,
        qty: item.quantity,
      })
    ),
    total: Number(order.total),
    minutesAgo,
    address:
      addressParts.join(", ") ||
      "Delivery address",
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
function mapBackendOwnerMenu(restaurant) {
  const categories =
    restaurant?.menuCategories || [];

  return [...categories]
    .sort(
      (first, second) =>
        (first.position || 0) -
        (second.position || 0)
    )
    .map((category) => ({
      id: category.id,
      name: category.name,

      items: (category.foodItems || []).map(
        (item) => ({
          id: item.id,
          categoryId: category.id,
          name: item.name,
          price: Number(item.price),
          desc: item.description || "",
          img: item.images?.[0]?.url || null,
          veg: item.isVeg,
          available: item.isAvailable,
          popular: item.isPopular,
        })
      ),
    }));
}
function App() {
  const [ownerAuthMode, setOwnerAuthMode] =
  useState("login");
  const [mode, setMode] = useState("dark");
  const theme = THEMES[mode];
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

const [orders, setOrders] = useState([]);

const [
  ownerRestaurant,
  setOwnerRestaurant,
] = useState(null);

const [
  ownerOrdersLoading,
  setOwnerOrdersLoading,
] = useState(true);

const [
  ownerOrdersError,
  setOwnerOrdersError,
] = useState("");
  const [menu, setMenu] = useState([]);
  const [analytics, setAnalytics] =
  useState({
    totalRevenue: 0,
    deliveredOrders: 0,
    averageOrderValue: 0,
    monthlyRevenue: [],
    topItems: [],
    categoryMix: [],
  });
  const handleAddMenuCategory = async (name) => {
  const response =
    await createOwnerMenuCategory({
      name,
      position: menu.length,
    });

  const createdCategory =
    response?.data || response;

  setMenu((currentMenu) => [
    ...currentMenu,
    {
      id: createdCategory.id,
      name: createdCategory.name,
      position:
        createdCategory.position ??
        currentMenu.length,
      items: [],
    },
  ]);

  return createdCategory;
};
const handleUpdateRestaurant =
  async (changes) => {
    const updatedRestaurant =
      await updateOwnerRestaurant(
        changes
      );

    setOwnerRestaurant(
      (currentRestaurant) => ({
        ...currentRestaurant,
        ...updatedRestaurant,
      })
    );

    return updatedRestaurant;
  };
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [ownerUser, setOwnerUser] =
  useState(() => getSavedOwner());

  const handleOwnerSignOut = () => {
  clearOwnerSession();
  setOwnerUser(null);
  setOwnerAuthMode("login");
};


  useEffect(() => {
  if (!ownerUser) return;

  let cancelled = false;

  const loadOwnerData = async () => {
    setOwnerOrdersLoading(true);
    setOwnerOrdersError("");

    try {
      const [
  restaurantData,
  orderData,
  analyticsData,
] = await Promise.all([
  getOwnerRestaurant(),
  getOwnerOrders(),
  getOwnerAnalytics(),
]);

      if (!cancelled) {
        setOwnerRestaurant(
          restaurantData
        );

        setMenu(
  mapBackendOwnerMenu(restaurantData)
);
setAnalytics(
  analyticsData?.data ||
    analyticsData
);
        setOrders(
          orderData.map((order) =>
            mapBackendOwnerOrder(order)
          )
        );
      }
    } catch (error) {
      if (!cancelled) {
        setOwnerOrdersError(
          error.message
        );
      }
    } finally {
      if (!cancelled) {
        setOwnerOrdersLoading(false);
      }
    }
  };

  const refreshOwnerOrders = async () => {
    try {
      const orderData =
        await getOwnerOrders();

      if (!cancelled) {
  const latestOrders = orderData.map(
    (order) =>
      mapBackendOwnerOrder(order)
  );

  setOrders((currentOrders) =>
    latestOrders.map((latestOrder) => {
      const currentOrder =
        currentOrders.find(
          (order) =>
            order.id === latestOrder.id
        );

      if (!currentOrder) {
        return latestOrder;
      }

      const latestTime = new Date(
        latestOrder.updatedAt
      ).getTime();

      const currentTime = new Date(
        currentOrder.updatedAt
      ).getTime();

      return latestTime >= currentTime
        ? latestOrder
        : currentOrder;
    })
  );

  setOwnerOrdersError("");
}
    } catch (error) {
      if (!cancelled) {
        setOwnerOrdersError(
          error.message
        );
      }
    }
  };

  loadOwnerData();

  const intervalId = window.setInterval(
    refreshOwnerOrders,
    2000
  );

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}, [ownerUser?.id]);

const handleOwnerLogin = async (
  email,
  password
) => {
  const loggedInOwner = await loginOwner(
    email,
    password
  );

  setOwnerUser(loggedInOwner);
};
if (
  !ownerUser &&
  ownerAuthMode === "signup"
) {
  return (
    <RestaurantOwnerSignup
      onBack={() =>
        setOwnerAuthMode("login")
      }
    />
  );
}

if (!ownerUser) {
  return (
    <PortalLogin
    onRegister={() =>
  setOwnerAuthMode("signup")
}
registerLabel="Register your restaurant"
      portalName="Restaurant Owner"
      description="Sign in to manage your restaurant, menu and customer orders."
      onLogin={handleOwnerLogin}
    />
  );
}

  const handleAdvance = async (
  orderId,
  nextStatus
) => {
  setOwnerOrdersError("");

  try {
    const updatedOrder =
      await updateOwnerOrderStatus(
        orderId,
        nextStatus
      );

    const mappedOrder =
      mapBackendOwnerOrder(updatedOrder);

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? mappedOrder
          : order
      )
    );
  } catch (error) {
    setOwnerOrdersError(error.message);
  }
};

const handleReject = async (orderId) => {
  setOwnerOrdersError("");

  try {
    const updatedOrder =
      await updateOwnerOrderStatus(
        orderId,
        "CANCELLED"
      );

    const mappedOrder =
      mapBackendOwnerOrder(updatedOrder);

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? mappedOrder
          : order
      )
    );
  } catch (error) {
    setOwnerOrdersError(error.message);
  }
};

  const handleToggleAvailability = async (
  categoryName,
  itemId
) => {
  try {
    const updatedItem =
      await toggleOwnerFoodItemAvailability(itemId);

    setMenu((currentMenu) =>
      currentMenu.map((category) =>
        category.name !== categoryName
          ? category
          : {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      available:
                        updatedItem.isAvailable,
                    }
                  : item
              ),
            }
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update item availability"
    );
  }
};
  const handleAddItem = async (
  categoryName,
  data
) => {
  try {
    const category = menu.find(
      (item) => item.name === categoryName
    );

    if (!category) {
      throw new Error("Menu category not found");
    }

    const createdItem =
      await createOwnerFoodItem({
        menuCategoryId: category.id,
        name: data.name,
        price: Number(data.price),
        description: data.desc,
        isVeg: data.veg,
      });

    const menuItem = {
      id: createdItem.id,
      categoryId: category.id,
      name: createdItem.name,
      price: Number(createdItem.price),
      desc: createdItem.description || "",
      img: createdItem.images?.[0]?.url || null,
      veg: createdItem.isVeg,
      available: createdItem.isAvailable,
      popular: createdItem.isPopular,
    };

    setMenu((currentMenu) =>
      currentMenu.map((item) =>
        item.name !== categoryName
          ? item
          : {
              ...item,
              items: [...item.items, menuItem],
            }
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to add menu item"
    );
  }
};
  const handleEditItem = async (
  categoryName,
  itemId,
  data
) => {
  try {
    const updatedItem =
      await updateOwnerFoodItem(itemId, {
        name: data.name,
        price: Number(data.price),
        description: data.desc,
        isVeg: data.veg,
      });

    setMenu((currentMenu) =>
      currentMenu.map((category) =>
        category.name !== categoryName
          ? category
          : {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      name: updatedItem.name,
                      price: Number(
                        updatedItem.price
                      ),
                      desc:
                        updatedItem.description ||
                        "",
                      veg: updatedItem.isVeg,
                      available:
                        updatedItem.isAvailable,
                    }
                  : item
              ),
            }
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update menu item"
    );
  }
};
  const handleDeleteItem = async (
  categoryName,
  itemId
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this food item?"
  );

  if (!confirmed) return;

  try {
    await deleteOwnerFoodItem(itemId);

    setMenu((currentMenu) =>
      currentMenu.map((category) =>
        category.name !== categoryName
          ? category
          : {
              ...category,
              items: category.items.filter(
                (item) => item.id !== itemId
              ),
            }
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to delete menu item"
    );
  }
};
  const handleToggleCoupon = (id) => setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const handleCreateCoupon = (data) => setCoupons((prev) => [{ id: `new-${Date.now()}`, active: true, uses: 0, ...data }, ...prev]);

  const TITLES = {
    dashboard: ["Dashboard", "Welcome back — here's how Basil & Bloom is doing today"],
    orders: ["Orders", "Manage incoming and active orders"],
    menu: ["Menu management", "Add, edit, and organize your dishes"],
    analytics: ["Analytics", "Performance insights for your restaurant"],
    coupons: ["Coupons", "Manage discount campaigns and promotions"],
    settings: ["Settings", "Restaurant profile and preferences"],
  };

  let page = null;
  if (view === "dashboard") page = <DashboardPage theme={theme} orders={orders} setView={setView} />;
  else if (view === "orders") page = <OrdersPage theme={theme} orders={orders} onAdvance={handleAdvance} onReject={handleReject} />;
  else if (view === "menu") page = <MenuPage theme={theme} menu={menu} onAddCategory={handleAddMenuCategory} onToggleAvailability={handleToggleAvailability} onAddItem={handleAddItem} onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} />;
  else if (view === "analytics") page = <AnalyticsPage theme={theme} analytics={analytics} />;
  else if (view === "coupons") page = <CouponsPage theme={theme} coupons={coupons} onToggle={handleToggleCoupon} onCreate={handleCreateCoupon} />;
  else if (view === "settings") page = <SettingsPage
  theme={theme}
  profile={ownerRestaurant}
  onSave={
    handleUpdateRestaurant
  }
/>;

  return (
    <div style={{ display: "flex", background: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <GlobalStyles theme={theme} />
      <Sidebar theme={theme} view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onSignOut={handleOwnerSignOut} restaurant={ownerRestaurant} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar theme={theme} mode={mode} setMode={setMode} title={TITLES[view][0]} subtitle={TITLES[view][1]} setMobileOpen={setMobileOpen} />
        <div key={view} className="owner-page-enter">{page}</div>
      </div>
    </div>
  );
}

export default App;
