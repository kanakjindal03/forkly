import PortalLogin from "../components/PortalLogin.jsx";
import DeliveryPartnerSignup from "../components/DeliveryPartnerSignup";

import {
  loginDeliveryPartner,
  getSavedDeliveryPartner,
  logoutDeliveryPartner,
  getDeliveryPartnerProfile,
  getAvailableDeliveries,
  getMyDeliveries,
  claimDelivery,
  updateDeliveryStatus,
  updateDeliveryAvailability,
  getDeliveryEarnings,
} from "../api/delivery.js";
import { useState, useEffect, useMemo } from "react";
import {
  Truck, Package, DollarSign, Star, Clock, MapPin, Phone, MessageCircle, CheckCircle2,
  ChefHat, Navigation, Home, Wallet, User, History as HistoryIcon, Sun, Moon, Power,
  ArrowLeft, X, Check, TrendingUp, ShieldCheck, Bike, Award, ChevronRight, Store, Loader2,
  Fuel, Calendar, ThumbsUp, AlertCircle,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const THEMES = {
  dark: {
    mode: "dark", bg: "#0B0F19", card: "#151A24", cardAlt: "#1A2130",
    border: "rgba(255,255,255,0.08)", primary: "#FF6B35", primaryHover: "#FF8555", primarySoft: "rgba(255,107,53,0.14)",
    accent: "#FFC857", accentSoft: "rgba(255,200,87,0.14)", success: "#22C55E", successSoft: "rgba(34,197,94,0.14)",
    error: "#EF4444", errorSoft: "rgba(239,68,68,0.14)", text: "#FFFFFF", textMuted: "#9CA3AF", textFaint: "#6B7280",
    shadow: "0 20px 50px rgba(0,0,0,0.45)", shadowSoft: "0 8px 24px rgba(0,0,0,0.3)", overlay: "rgba(5,7,12,0.72)", chartGrid: "rgba(255,255,255,0.06)",
  },
  light: {
    mode: "light", bg: "#FBF8F3", card: "#FFFFFF", cardAlt: "#F6F1E8",
    border: "rgba(20,23,31,0.08)", primary: "#FF6B35", primaryHover: "#E85A2A", primarySoft: "rgba(255,107,53,0.10)",
    accent: "#E8A93D", accentSoft: "rgba(232,169,61,0.14)", success: "#16A34A", successSoft: "rgba(22,163,74,0.10)",
    error: "#DC2626", errorSoft: "rgba(220,38,38,0.10)", text: "#14171F", textMuted: "#6B6558", textFaint: "#948C7D",
    shadow: "0 20px 50px rgba(30,24,10,0.10)", shadowSoft: "0 8px 24px rgba(30,24,10,0.06)", overlay: "rgba(20,16,8,0.5)", chartGrid: "rgba(20,23,31,0.06)",
  },
};

const IMG = {
  partner: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
  cust1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  cust2: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  cust3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  cust4: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
};

const PARTNER = {
  name: "Diego Marquez", photo: IMG.partner, rating: 4.9, deliveries: 1284,
  vehicle: "Scooter · Blue Vespa", phone: "+1 (555) 019-2231", memberSince: "Mar 2023",
  docsVerified: true,
};

const AVAILABLE_ORDERS = [
  { id: "F-3091", restaurant: "Patty House", restaurantAddr: "101 Maple Ave, Uptown", customerAddr: "221B Baker Street, Apt 4", distance: "1.4 mi", payout: 7.8, items: 3, prepTime: "6 min" },
  { id: "F-3090", restaurant: "Sakura Sushi Bar", restaurantAddr: "5 Harbor Walk, Bayside", customerAddr: "500 Market Square, Floor 9", distance: "2.1 mi", payout: 9.4, items: 5, prepTime: "10 min" },
  { id: "F-3089", restaurant: "Green Bowl Co.", restaurantAddr: "29 Willow Court, Riverside", customerAddr: "14 Willow Court", distance: "0.6 mi", payout: 5.6, items: 2, prepTime: "4 min" },
];

const DELIVERY_HISTORY = [
  { id: "F-3082", restaurant: "Spice Route", date: "Today, 1:20 PM", earnings: 8.9, rating: 5, distance: "1.8 mi" },
  { id: "F-3081", restaurant: "Basil & Bloom", date: "Today, 12:05 PM", earnings: 7.2, rating: 5, distance: "1.2 mi" },
  { id: "F-3079", restaurant: "Golden Wok", date: "Today, 11:15 AM", earnings: 6.4, rating: 4, distance: "0.9 mi" },
  { id: "F-3070", restaurant: "Taco Fiesta", date: "Yesterday, 7:40 PM", earnings: 9.8, rating: 5, distance: "2.4 mi" },
  { id: "F-3065", restaurant: "Sweet Tooth Bakery", date: "Yesterday, 6:05 PM", earnings: 5.1, rating: 5, distance: "0.7 mi" },
  { id: "F-3060", restaurant: "Sakura Sushi Bar", date: "Yesterday, 3:30 PM", earnings: 10.2, rating: 4, distance: "2.9 mi" },
];

const WEEK_EARNINGS = [
  { day: "Mon", amount: 62 }, { day: "Tue", amount: 74 }, { day: "Wed", amount: 58 },
  { day: "Thu", amount: 81 }, { day: "Fri", amount: 112 }, { day: "Sat", amount: 138 }, { day: "Sun", amount: 96 },
];

const RECENT_RATINGS = [
  { name: "Priya N.", avatar: IMG.cust1, rating: 5, text: "Super fast and friendly delivery!" },
  { name: "Marcus B.", avatar: IMG.cust2, rating: 5, text: "Right on time, food was still hot." },
  { name: "Alina R.", avatar: IMG.cust3, rating: 4, text: "Good service, easy to find the door." },
];

const DELIVERY_STAGES = [
  { key: "accepted", label: "Head to restaurant", icon: Navigation },
  { key: "picked_up", label: "Picked up order", icon: Package },
  { key: "on_the_way", label: "On the way to customer", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  function mapBackendDelivery(order) {
  const stageMap = {
    READY: "accepted",
    PICKED_UP: "picked_up",
    ON_THE_WAY: "on_the_way",
    DELIVERED: "delivered",
  };

  

  const restaurantAddress = [
    order.restaurant?.addressLine,
    order.restaurant?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const customerAddress = [
    order.address?.line1,
    order.address?.city,
    order.address?.state,
    order.address?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const itemCount =
    order.items?.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    ) || 0;

  const deliveryDate = new Date(
    order.deliveredAt || order.createdAt
  ).toLocaleString();

  return {
    id: order.orderNumber || order.id,
    backendId: order.id,
    backendStatus: order.status,

    restaurant:
      order.restaurant?.name || "Restaurant",

    restaurantAddr:
      restaurantAddress || "Restaurant address",

    customerAddr:
      customerAddress || "Customer address",

    distance: "1.2 mi",
    payout: Number(order.deliveryFee || 0),
    items: itemCount,

    prepTime:
      order.status === "READY"
        ? "Ready now"
        : "In progress",

    stage: stageMap[order.status] || "accepted",

    date: deliveryDate,
    earnings: Number(order.deliveryFee || 0),
    rating: 5,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
];
function mapBackendDelivery(order) {
  const stageMap = {
    READY: "accepted",
    PICKED_UP: "picked_up",
    ON_THE_WAY: "on_the_way",
    DELIVERED: "delivered",
  };

  const restaurantAddress = [
    order.restaurant?.addressLine,
    order.restaurant?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const customerAddress = [
    order.address?.line1,
    order.address?.city,
    order.address?.state,
    order.address?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const itemCount =
    order.items?.reduce(
      (total, item) =>
        total + (item.quantity || 1),
      0
    ) || 0;

  return {
    id: order.orderNumber || order.id,
    backendId: order.id,
    backendStatus: order.status,

    restaurant:
      order.restaurant?.name || "Restaurant",

    restaurantAddr:
      restaurantAddress || "Restaurant address",

    customerAddr:
      customerAddress || "Customer address",

    distance: "1.2 mi",
    payout: Number(order.deliveryFee || 0),
    items: itemCount,

    prepTime:
      order.status === "READY"
        ? "Ready now"
        : "In progress",

    stage: stageMap[order.status] || "accepted",

    date: new Date(
      order.deliveredAt || order.createdAt
    ).toLocaleString(),

    earnings: Number(order.deliveryFee || 0),
    rating: 5,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
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

function StarRating({ rating, size = 12, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <Star size={size} color={color || "#FFC857"} fill={color || "#FFC857"} />
      <span style={{ fontSize: size + 1, fontWeight: 600 }}>{rating}</span>
    </span>
  );
}

function PrimaryButton({ children, onClick, theme, full, size = "md", icon, variant = "solid", disabled }) {
  const pad = size === "sm" ? "9px 14px" : size === "lg" ? "15px 22px" : "12px 18px";
  const fontSize = size === "sm" ? 12.5 : size === "lg" ? 15 : 13.5;
  const styles = variant === "solid" ? { background: disabled ? theme.textFaint : theme.primary, color: "#fff", border: "none" }
    : variant === "outline" ? { background: "transparent", color: theme.text, border: `1px solid ${theme.border}` }
    : { background: theme.errorSoft, color: theme.error, border: "none" };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: pad, fontSize, fontWeight: 700, borderRadius: 13, width: full ? "100%" : "auto", cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT_STACK, ...styles, opacity: disabled ? 0.7 : 1,
    }}>
      {icon}{children}
    </button>
  );
}

/* =========================================================================
   TOP STATUS BAR
   ========================================================================= */
function TopStatusBar({ theme, mode, setMode, online, setOnline, todayEarnings }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30, background: theme.mode === "dark" ? "rgba(11,15,25,0.9)" : "rgba(251,248,243,0.9)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 480, margin: "0 auto" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Bike size={17} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.3 }}>Forkly Driver</div>
          <div style={{ fontSize: 10.5, color: theme.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: online ? theme.success : theme.textFaint }} />
            {online ? "Online" : "Offline"}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14.5, fontWeight: 800 }}>${todayEarnings.toFixed(2)}</div>
          <div style={{ fontSize: 10, color: theme.textMuted }}>Today</div>
        </div>
        <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ width: 34, height: 34, borderRadius: 10, background: theme.card, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          {mode === "dark" ? <Sun size={15} color={theme.text} /> : <Moon size={15} color={theme.text} />}
        </button>
        <button onClick={() => setOnline((v) => !v)} style={{
          width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer", flexShrink: 0,
          background: online ? theme.successSoft : theme.errorSoft, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Power size={15} color={online ? theme.success : theme.error} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   BOTTOM TABS
   ========================================================================= */
function BottomTabs({ theme, tab, setTab }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "history", label: "History", icon: HistoryIcon },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <nav style={{ position: "sticky", bottom: 0, background: theme.card, borderTop: `1px solid ${theme.border}`, padding: "10px 6px calc(10px + env(safe-area-inset-bottom))" }}>
      <div style={{ display: "flex", justifyContent: "space-around", maxWidth: 480, margin: "0 auto" }}>
        {items.map((it) => {
          const Ico = it.icon;
          const active = tab === it.id;
          return (
            <button key={it.id} onClick={() => setTab(it.id)} style={{
              background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              color: active ? theme.primary : theme.textMuted, cursor: "pointer", padding: "4px 14px", fontFamily: FONT_STACK,
            }}>
              <Ico size={20} fill={active ? theme.primarySoft : "none"} />
              <span style={{ fontSize: 10.5, fontWeight: 600 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================================
   ORDER REQUEST CARD
   ========================================================================= */
function OrderRequestCard({ order, theme, onOpen }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={17} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{order.restaurant}</div>
            <div style={{ fontSize: 11.5, color: theme.textMuted }}>{order.items} items · ready in {order.prepTime}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: theme.success }}>${order.payout.toFixed(2)}</div>
          <div style={{ fontSize: 10.5, color: theme.textMuted }}>{order.distance}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}`, fontSize: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.primary, flexShrink: 0 }} /> {order.restaurantAddr}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.success, flexShrink: 0 }} /> {order.customerAddr}</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <PrimaryButton theme={theme} full onClick={() => onOpen(order)}>View request</PrimaryButton>
      </div>
    </div>
  );
}

/* =========================================================================
   REQUEST DETAIL MODAL
   ========================================================================= */
function RequestDetailModal({ theme, order, onClose, onAccept, onReject }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: theme.overlay }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 480, background: theme.bg, borderRadius: "24px 24px 0 0", padding: 24, boxShadow: theme.shadow, animation: "delivery-slide-up .25s ease" }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: theme.border, margin: "0 auto 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>New delivery request</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: theme.success }}>${order.payout.toFixed(2)}</div>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: theme.primary }} />
              <div style={{ width: 2, flex: 1, minHeight: 34, background: theme.border }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: theme.success }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{order.restaurant}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{order.restaurantAddr}</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Customer address</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{order.customerAddr}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, background: theme.cardAlt, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{order.distance}</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>Distance</div>
          </div>
          <div style={{ flex: 1, background: theme.cardAlt, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{order.items}</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>Items</div>
          </div>
          <div style={{ flex: 1, background: theme.cardAlt, borderRadius: 14, padding: 12, textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{order.prepTime}</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>Prep time</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <PrimaryButton theme={theme} variant="danger" full onClick={() => onReject(order.id)}>Decline</PrimaryButton>
          <PrimaryButton theme={theme} full onClick={() => onAccept(order)}>Accept delivery</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ACTIVE DELIVERY SCREEN
   ========================================================================= */
function ActiveDeliveryScreen({ theme, delivery, onAdvance, onClose }) {
  const stageIdx = DELIVERY_STAGES.findIndex((s) => s.key === delivery.stage);
  const pct = (stageIdx / (DELIVERY_STAGES.length - 1)) * 100;
  const isDelivered = delivery.stage === "delivered";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 75, background: theme.bg, overflowY: "auto" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 18px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          {!isDelivered && <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "flex" }}><ArrowLeft size={18} /></button>}
          <div style={{ fontWeight: 800, fontSize: 17 }}>Delivery #{delivery.id}</div>
        </div>

        <div style={{ background: theme.cardAlt, borderRadius: 18, padding: "24px 18px", marginBottom: 18, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}><Store size={15} color="#fff" /></div>
              <span style={{ fontSize: 10, color: theme.textMuted }}>Restaurant</span>
            </div>
            <div style={{ position: "absolute", left: 32, right: 32, top: 16, borderTop: `2px dashed ${theme.border}`, zIndex: 0 }} />
            <div style={{
              position: "absolute", top: 2, left: `calc(${pct}% * 0.72 + 15%)`, zIndex: 1, transition: "left 1s ease",
              width: 28, height: 28, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadowSoft,
            }}>
              <Navigation size={14} color="#14171F" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: theme.success, display: "flex", alignItems: "center", justifyContent: "center" }}><Home size={15} color="#fff" /></div>
              <span style={{ fontSize: 10, color: theme.textMuted }}>Customer</span>
            </div>
          </div>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 18, marginBottom: 18 }}>
          {DELIVERY_STAGES.map((s, i) => {
            const Ico = s.icon || CheckCircle2;
            const done = i <= stageIdx;
            const isLast = i === DELIVERY_STAGES.length - 1;
            return (
              <div key={s.key || i} style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? theme.success : theme.cardAlt, color: done ? "#fff" : theme.textFaint, border: done ? "none" : `1px solid ${theme.border}` }}>
                    <Ico size={15} />
                  </div>
                  {!isLast && <div style={{ width: 2, flex: 1, minHeight: 26, background: i < stageIdx ? theme.success : theme.border }} />}
                </div>
                <div style={{ paddingBottom: isLast ? 0 : 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: done ? theme.text : theme.textFaint }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 14, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
            <MapPin size={13} /> {stageIdx < 1 ? "Pickup address" : "Drop-off address"}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{stageIdx < 1 ? delivery.restaurantAddr : delivery.customerAddr}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <PrimaryButton theme={theme} variant="outline" full size="sm" icon={<Phone size={13} />}>Call</PrimaryButton>
<PrimaryButton
  theme={theme}
  variant="outline"
  full
  size="sm"
>
  Message
</PrimaryButton>
          </div>
        </div>

        {!isDelivered ? (
          <PrimaryButton theme={theme} full size="lg" onClick={onAdvance} icon={<CheckCircle2 size={16} />}>
            {DELIVERY_STAGES[stageIdx + 1]?.label || "Complete"}
          </PrimaryButton>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: theme.successSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <CheckCircle2 size={28} color={theme.success} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Delivered! You earned ${delivery.payout.toFixed(2)}</div>
            <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 20 }}>Great work. Ready for your next delivery?</p>
            <PrimaryButton theme={theme} full size="lg" onClick={onClose}>Back to home</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   HOME PAGE
   ========================================================================= */
function HomePage({ theme, online, setOnline, availableOrders, onOpenRequest, activeDelivery, onContinueDelivery }) {
  if (activeDelivery && activeDelivery.stage !== "delivered") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 18px 90px" }}>
        <div style={{ background: `linear-gradient(135deg, ${theme.primary}, #E85A2A)`, borderRadius: 20, padding: 22, color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, opacity: 0.9, marginBottom: 10 }}>
            <Truck size={15} /> DELIVERY IN PROGRESS
          </div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{activeDelivery.restaurant}</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 18 }}>Order #{activeDelivery.id} · ${activeDelivery.payout.toFixed(2)} payout</div>
          <button onClick={onContinueDelivery} style={{ width: "100%", background: "#fff", color: theme.primary, border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONT_STACK }}>
            Continue delivery
          </button>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 12.5, marginTop: 16, textAlign: "center" }}>You'll see new requests once this delivery is complete.</p>
      </div>
    );
  }

  if (!online) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: theme.cardAlt, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Power size={30} color={theme.textMuted} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>You're offline</div>
        <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 22 }}>Go online to start receiving delivery requests nearby.</p>
        <PrimaryButton theme={theme} full size="lg" onClick={() => setOnline(true)} icon={<Power size={16} />}>Go online</PrimaryButton>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 18px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>Delivery requests</div>
        <span style={{ fontSize: 12, color: theme.textMuted }}>{availableOrders.length} nearby</span>
      </div>
      {availableOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: theme.textMuted }}>
          <Loader2 size={26} className="delivery-spin" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 700, fontSize: 14.5, color: theme.text }}>Looking for nearby orders…</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {availableOrders.map((o) => <OrderRequestCard key={o.id} order={o} theme={theme} onOpen={onOpenRequest} />)}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   EARNINGS PAGE
   ========================================================================= */
function EarningsPage({
  theme,
  earningsSummary,
}) {
  const breakdown =
    earningsSummary?.dailyBreakdown || [];

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "18px 18px 90px",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          marginBottom: 16,
        }}
      >
        Earnings
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              color: theme.textMuted,
              marginBottom: 6,
            }}
          >
            Today
          </div>

          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            $
            {Number(
              earningsSummary?.todayEarnings || 0
            ).toFixed(2)}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              color: theme.textMuted,
              marginBottom: 6,
            }}
          >
            Last 7 days
          </div>

          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            $
            {Number(
              earningsSummary?.last7Days || 0
            ).toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 14,
          }}
        >
          Last 7 days
        </div>

        <ResponsiveContainer
          width="100%"
          height={180}
        >
          <BarChart data={breakdown}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.chartGrid}
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: theme.textMuted,
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: theme.textMuted,
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <Tooltip
              content={
                <CustomTooltip theme={theme} />
              }
            />

            <Bar
              dataKey="amount"
              fill={theme.primary}
              radius={[6, 6, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          Delivery summary
        </div>

        {[
          {
            label: "Deliveries in last 7 days",
            value:
              earningsSummary?.deliveryCount || 0,
          },
          {
            label: "Lifetime deliveries",
            value:
              earningsSummary?.lifetimeDeliveries ||
              0,
          },
          {
            label: "Current rating",
            value:
              Number(
                earningsSummary?.rating || 0
              ) > 0
                ? Number(
                    earningsSummary.rating
                  ).toFixed(1)
                : "New",
          },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: `1px solid ${theme.border}`,
              fontSize: 13,
            }}
          >
            <span
              style={{
                color: theme.textMuted,
              }}
            >
              {row.label}
            </span>

            <span style={{ fontWeight: 700 }}>
              {row.value}
            </span>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            color: theme.textFaint,
            fontSize: 11,
          }}
        >
          <ShieldCheck size={13} />
          Earnings are calculated from completed
          delivery fees.
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HISTORY PAGE
   ========================================================================= */
function HistoryPage({ theme, history }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 18px 90px" }}>
      <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Delivery history</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((h) => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: theme.successSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={18} color={theme.success} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{h.restaurant}</div>
              <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{h.date} · {h.distance}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>${h.earnings.toFixed(2)}</div>
              <StarRating rating={h.rating} size={10.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   PROFILE PAGE
   ========================================================================= */
function ProfilePage({ theme, online, setOnline, onLogout,profile, }) {
  if (!profile) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        color: theme.textMuted,
      }}
    >
      Loading your profile...
    </div>
  );
}
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "18px 18px 90px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 18, marginBottom: 18 }}>
        <img src={profile.photo} alt="" style={{ width: 62, height: 62, borderRadius: "50%", objectFit: "cover" }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{profile.name}</div>
          <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>{profile.vehicle}</div>
          <div style={{ marginTop: 4 }}><StarRating rating={profile.rating} size={13} /> <span style={{ color: theme.textMuted, fontSize: 11.5 }}>· {profile.deliveries} deliveries</span></div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>Availability</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{online ? "You're visible to nearby restaurants" : "You're currently offline"}</div>
        </div>
        <button onClick={() => setOnline((v) => !v)} style={{ width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", background: online ? theme.success : theme.border, flexShrink: 0 }}>
          <span style={{ position: "absolute", top: 3, left: online ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
        </button>
      </div>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 18, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Account details</div>
        {[
          { icon: Phone, label: "Phone", value: profile.phone },
          { icon: Calendar, label: "Member since", value: profile.memberSince },
          { icon: ShieldCheck, label: "Documents", value: profile.docsVerified ? "Verified" : "Pending" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: `1px solid ${theme.border}` }}>
            <r.icon size={15} color={theme.textMuted} />
            <span style={{ fontSize: 12.5, color: theme.textMuted, flex: 1 }}>{r.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div
  style={{
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  }}
>
  <div
    style={{
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 10,
    }}
  >
    Delivery feedback
  </div>

  <div
    style={{
      color: theme.textMuted,
      fontSize: 12.5,
      lineHeight: 1.6,
    }}
  >
    {profile.deliveries === 0
      ? "No ratings yet. Customer feedback will appear after you complete deliveries."
      : `Your current delivery rating is ${profile.rating.toFixed(
          1
        )}.`}
  </div>
</div>

      <PrimaryButton theme={theme} variant="danger" full onClick={onLogout}>Sign out</PrimaryButton>
    </div>
  );
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; }
      button { font-family: inherit; }
      input:focus, button:focus-visible { outline: 2px solid ${theme.primary}; outline-offset: 1px; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 8px; }
      @keyframes delivery-slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes delivery-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes delivery-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .delivery-spin { animation: delivery-spin 1s linear infinite; }
      .delivery-page-enter { animation: delivery-fade .3s ease; }
    `}</style>
  );
}
function mapDeliveryPartnerProfile(profile) {
  return {
    name:
      profile.user?.name ||
      profile.user?.email ||
      "Delivery partner",

    email: profile.user?.email || "",

    photo:
      profile.user?.avatarUrl || IMG.partner,

    rating: Number(profile.rating || 0),

    deliveries: Number(
      profile.totalDeliveries || 0
    ),

    vehicle: [
      profile.vehicleType,
      profile.vehicleNumber,
    ]
      .filter(Boolean)
      .join(" · "),

    phone:
      profile.user?.phone || "Not provided",

    memberSince: profile.createdAt
      ? new Date(
          profile.createdAt
        ).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        })
      : "—",

    docsVerified:
      profile.status === "ACTIVE",

    licenseNumber:
      profile.licenseNumber || "Not provided",

      isAvailable: Boolean(profile.isAvailable),
  };
}

function App() {
  const [
  deliveryAuthMode,
  setDeliveryAuthMode,
] = useState("login");
  const [mode, setMode] = useState("dark");
  const theme = THEMES[mode];
  const [tab, setTab] = useState("home");
  const [online, setOnline] = useState(true);
  const handleAvailabilityChange = async (
  valueOrUpdater
) => {
  const nextValue =
    typeof valueOrUpdater === "function"
      ? valueOrUpdater(online)
      : Boolean(valueOrUpdater);

  try {
    await updateDeliveryAvailability(
      nextValue
    );

    setOnline(nextValue);

    setDriverProfile((current) =>
      current
        ? {
            ...current,
            isAvailable: nextValue,
          }
        : current
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update availability"
    );
  }
};
  const [deliveryUser, setDeliveryUser] = useState(
  () => getSavedDeliveryPartner()
);
const [driverProfile, setDriverProfile] =
  useState(null);

useEffect(() => {
  if (!deliveryUser) {
    setDriverProfile(null);
    return;
  }

  let cancelled = false;

  async function loadDriverProfile() {
    try {
      const response =
        await getDeliveryPartnerProfile();

      const profile =
        response?.data || response;

      if (!cancelled) {
          const mappedProfile =
            mapDeliveryPartnerProfile(profile);

          setDriverProfile(mappedProfile);
          setOnline(mappedProfile.isAvailable);
}
    } catch (error) {
      console.error(
        "Unable to load delivery profile:",
        error
      );
    }
  }

  loadDriverProfile();

  return () => {
    cancelled = true;
  };
}, [deliveryUser]);

  const [availableOrders, setAvailableOrders] = useState([]);
const [requestModalOrder, setRequestModalOrder] = useState(null);
const [activeDelivery, setActiveDelivery] = useState(null);
const [showActiveScreen, setShowActiveScreen] = useState(false);
const [history, setHistory] = useState([]);
const [todayEarnings, setTodayEarnings] = useState(0);
const [
  earningsSummary,
  setEarningsSummary,
] = useState({
  todayEarnings: 0,
  last7Days: 0,
  deliveryCount: 0,
  lifetimeDeliveries: 0,
  rating: 0,
  dailyBreakdown: [],
});
useEffect(() => {
  if (!deliveryUser) return;

  let cancelled = false;

  async function loadEarnings() {
    try {
      const response =
        await getDeliveryEarnings();

      const data =
        response?.data || response;

      const mappedEarnings = {
        todayEarnings: Number(
          data?.todayEarnings || 0
        ),
        last7Days: Number(
          data?.last7Days || 0
        ),
        deliveryCount: Number(
          data?.deliveryCount || 0
        ),
        lifetimeDeliveries: Number(
          data?.lifetimeDeliveries || 0
        ),
        rating: Number(data?.rating || 0),
        dailyBreakdown: Array.isArray(
          data?.dailyBreakdown
        )
          ? data.dailyBreakdown.map(
              (day) => ({
                ...day,
                amount: Number(
                  day.amount || 0
                ),
              })
            )
          : [],
      };

      if (!cancelled) {
        setEarningsSummary(
          mappedEarnings
        );
        setTodayEarnings(
          mappedEarnings.todayEarnings
        );
      }
    } catch (error) {
      console.error(
        "Unable to load delivery earnings:",
        error
      );
    }
  }

  loadEarnings();

  return () => {
    cancelled = true;
  };
}, [deliveryUser]);
  const handleDeliveryLogin = async (email, password) => {
  const user = await loginDeliveryPartner(email, password);
  setDeliveryUser(user);
};
const handleDeliveryLogout = () => {
  logoutDeliveryPartner();
  setDeliveryUser(null);
  setAvailableOrders([]);
  setActiveDelivery(null);
  setHistory([]);
  setTodayEarnings(0);
  setTab("home");
};
useEffect(() => {
  if (!deliveryUser) return;

  let cancelled = false;

  const loadDeliveries = async () => {
    try {
      const [availableData, assignedData] =
        await Promise.all([
          getAvailableDeliveries(),
          getMyDeliveries(),
        ]);

      if (cancelled) return;

      const available = (availableData || []).map(
        mapBackendDelivery
      );

      const assignedOrders = Array.isArray(assignedData)
  ? assignedData
  : [];

const active = assignedOrders
  .filter((order) =>
    [
      "READY",
      "PICKED_UP",
      "ON_THE_WAY",
    ].includes(order.status)
  )
  .map(mapBackendDelivery)[0];

const completed = assignedOrders
  .filter(
    (order) => order.status === "DELIVERED"
  )
  .map(mapBackendDelivery);

      const today = new Date().toDateString();

      const earnedToday = completed
        .filter(
          (order) =>
            new Date(order.updatedAt).toDateString() ===
            today
        )
        .reduce(
          (total, order) => total + order.earnings,
          0
        );

      setAvailableOrders(available);
      setActiveDelivery(active || null);

      setHistory(completed);
      setTodayEarnings(earnedToday);
    } catch (error) {
      console.error(
        "Unable to load deliveries:",
        error
      );
    }
  };

  loadDeliveries();

  const intervalId = window.setInterval(
    loadDeliveries,
    2000
  );

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}, [deliveryUser]);




  const handleAccept = async (order) => {
  try {
    const updatedOrder = await claimDelivery(
      order.backendId
    );

    const delivery =
      mapBackendDelivery(updatedOrder);

    setAvailableOrders((current) =>
      current.filter(
        (item) => item.backendId !== order.backendId
      )
    );

    setActiveDelivery(delivery);
    setShowActiveScreen(true);
    setRequestModalOrder(null);
  } catch (error) {
    alert(error.message);
  }
};

  const handleAdvance = async () => {
  if (!activeDelivery) return;

  const nextStatus = {
    READY: "PICKED_UP",
    PICKED_UP: "ON_THE_WAY",
    ON_THE_WAY: "DELIVERED",
  }[activeDelivery.backendStatus];

  if (!nextStatus) return;

  try {
    const updatedOrder =
      await updateDeliveryStatus(
        activeDelivery.backendId,
        nextStatus
      );

    const updatedDelivery =
      mapBackendDelivery(updatedOrder);

    setActiveDelivery(updatedDelivery);

    if (nextStatus === "DELIVERED") {
      setHistory((current) => [
        updatedDelivery,
        ...current.filter(
          (order) =>
            order.backendId !==
            updatedDelivery.backendId
        ),
      ]);

      setTodayEarnings(
        (current) =>
          current + updatedDelivery.earnings
      );
    }
  } catch (error) {
    alert(
      error.message ||
        "Unable to update delivery status"
    );
  }
};

  const handleCloseActiveScreen = () => {
    setShowActiveScreen(false);
    if (activeDelivery?.stage === "delivered") setActiveDelivery(null);
  };
if (
  !deliveryUser &&
  deliveryAuthMode === "signup"
) {
  return (
    <DeliveryPartnerSignup
      onBack={() =>
        setDeliveryAuthMode("login")
      }
    />
  );
}
  if (!deliveryUser) {
  return (
    <PortalLogin
      portalName="Delivery Partner Portal"
      description="Sign in to view assigned deliveries and update their status."
      onLogin={handleDeliveryLogin}
      onRegister={() =>
  setDeliveryAuthMode("signup")
}
registerLabel="Apply as a delivery partner"
    />
  );
}

  let page = null;
  if (tab === "home") page = <HomePage theme={theme} online={online} setOnline={handleAvailabilityChange} availableOrders={availableOrders} onOpenRequest={setRequestModalOrder} activeDelivery={activeDelivery} onContinueDelivery={() => setShowActiveScreen(true)} />;
  else if (tab === "earnings") page = <EarningsPage
  theme={theme}
  earningsSummary={earningsSummary}
/>;
  else if (tab === "history") page = <HistoryPage theme={theme} history={history} />;
  else if (tab === "profile") page = <ProfilePage theme={theme} online={online} setOnline={handleAvailabilityChange} profile={driverProfile} onLogout={handleDeliveryLogout} />;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: FONT_STACK, display: "flex", flexDirection: "column" }}>
      <GlobalStyles theme={theme} />
      <TopStatusBar theme={theme} mode={mode} setMode={setMode} online={online} setOnline={handleAvailabilityChange} todayEarnings={todayEarnings} />
      <div key={tab} className="delivery-page-enter" style={{ flex: 1 }}>{page}</div>
      <BottomTabs theme={theme} tab={tab} setTab={setTab} />

      {requestModalOrder && (
        <RequestDetailModal theme={theme} order={requestModalOrder} onClose={() => setRequestModalOrder(null)} onAccept={handleAccept} onReject={handleReject} />
      )}
      {showActiveScreen && activeDelivery && (
        <ActiveDeliveryScreen theme={theme} delivery={activeDelivery} onAdvance={handleAdvance} onClose={handleCloseActiveScreen} />
      )}
    </div>
  );
}

export default App;
