import PortalLogin from "../components/PortalLogin.jsx";

import {
  loginAdmin,
  getSavedAdmin,
  logoutAdmin,
  getAdminStats,
  getRestaurantApplications,
  reviewRestaurantApplication,
  getPartnerApplications,
  reviewPartnerApplication,
  getAdminUsers,
setAdminUserActive,
getAdminRestaurants,
setAdminRestaurantStatus,
getAdminPartners,
getAdminOrders,
setAdminPartnerStatus,
getAdminCategories,
createAdminCategory,
getAdminOffers,
toggleAdminOffer,
} from "../api/admin.js";
import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Users, Store, Bike, Package, Tag, FileText, Settings, Bell, Search,
  ChevronDown, ChevronRight, Plus, Pencil, Trash2, Check, X, Clock, Star, TrendingUp,
  TrendingDown, DollarSign, MapPin, Phone, CheckCircle2, XCircle, Sun, Moon, Menu as MenuIcon,
  LogOut, MoreVertical, ShieldCheck, ShieldAlert, AlertTriangle, Percent, Filter, Loader2,
  UserCheck, UserX, Ban, RotateCcw, Download, Eye, Truck, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const THEMES = {
  dark: {
    mode: "dark", bg: "#0B0F19", sidebar: "#0E1320", card: "#151A24", cardAlt: "#1A2130",
    border: "rgba(255,255,255,0.08)", primary: "#FF6B35", primaryHover: "#FF8555", primarySoft: "rgba(255,107,53,0.14)",
    accent: "#FFC857", accentSoft: "rgba(255,200,87,0.14)", success: "#22C55E", successSoft: "rgba(34,197,94,0.14)",
    error: "#EF4444", errorSoft: "rgba(239,68,68,0.14)", warning: "#F59E0B", warningSoft: "rgba(245,158,11,0.14)",
    text: "#FFFFFF", textMuted: "#9CA3AF", textFaint: "#6B7280",
    shadow: "0 20px 50px rgba(0,0,0,0.45)", shadowSoft: "0 8px 24px rgba(0,0,0,0.3)", overlay: "rgba(5,7,12,0.72)", chartGrid: "rgba(255,255,255,0.06)",
  },
  light: {
    mode: "light", bg: "#FBF8F3", sidebar: "#FFFFFF", card: "#FFFFFF", cardAlt: "#F6F1E8",
    border: "rgba(20,23,31,0.08)", primary: "#FF6B35", primaryHover: "#E85A2A", primarySoft: "rgba(255,107,53,0.10)",
    accent: "#E8A93D", accentSoft: "rgba(232,169,61,0.14)", success: "#16A34A", successSoft: "rgba(22,163,74,0.10)",
    error: "#DC2626", errorSoft: "rgba(220,38,38,0.10)", warning: "#D97706", warningSoft: "rgba(217,119,6,0.10)",
    text: "#14171F", textMuted: "#6B6558", textFaint: "#948C7D",
    shadow: "0 20px 50px rgba(30,24,10,0.10)", shadowSoft: "0 8px 24px rgba(30,24,10,0.06)", overlay: "rgba(20,16,8,0.5)", chartGrid: "rgba(20,23,31,0.06)",
  },
};

const IMG = {
  a1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  a2: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  a3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  a4: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  a5: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
};

/* =========================================================================
   MOCK DATA
   ========================================================================= */
const PLATFORM_STATS = {
  totalRevenue: 284650, totalUsers: 12480, totalRestaurants: 186, totalPartners: 342, totalOrders: 38920,
};

const REVENUE_TREND = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(16000 + Math.sin(i / 1.6) * 5000 + i * 900),
  orders: Math.round(2400 + Math.cos(i / 2) * 500 + i * 90),
}));

const SIGNUP_TREND = [
  { day: "Mon", users: 42, restaurants: 2 }, { day: "Tue", users: 58, restaurants: 1 }, { day: "Wed", users: 51, restaurants: 3 },
  { day: "Thu", users: 66, restaurants: 2 }, { day: "Fri", users: 89, restaurants: 4 }, { day: "Sat", users: 112, restaurants: 3 }, { day: "Sun", users: 97, restaurants: 1 },
];

function mkUser(id, name, email, avatar, orders, status, joined) {
  return { id, name, email, avatar, orders, status, joined };
}
const USERS = [
  mkUser("U-1001", "Priya Nair", "priya.nair@mail.com", IMG.a1, 34, "active", "Jan 12, 2025"),
  mkUser("U-1002", "Marcus Bell", "marcus.bell@mail.com", IMG.a2, 21, "active", "Feb 3, 2025"),
  mkUser("U-1003", "Alina Rossi", "alina.rossi@mail.com", IMG.a3, 58, "active", "Nov 28, 2024"),
  mkUser("U-1004", "James Ito", "james.ito@mail.com", IMG.a4, 9, "suspended", "Jun 14, 2025"),
  mkUser("U-1005", "Sarah Quinn", "sarah.quinn@mail.com", IMG.a1, 12, "active", "Mar 30, 2025"),
  mkUser("U-1006", "Diego Marquez", "diego.m@mail.com", IMG.a2, 4, "active", "Jul 2, 2025"),
];

const RESTAURANT_APPLICATIONS = [
  { id: "R-501", name: "Cedar & Sage", cuisine: "Mediterranean", owner: "Layla Haddad", submitted: "2 days ago" },
  { id: "R-502", name: "Bao House", cuisine: "Taiwanese", owner: "Wei Chen", submitted: "5 hours ago" },
  { id: "R-503", name: "Ember Grill", cuisine: "Steakhouse", owner: "Tom Bradley", submitted: "1 day ago" },
];

const APPROVED_RESTAURANTS = [
  { id: "R-1", name: "Basil & Bloom", cuisine: "Italian", rating: 4.7, revenue: 18420, status: "active" },
  { id: "R-2", name: "Golden Wok", cuisine: "Chinese", rating: 4.5, revenue: 15230, status: "active" },
  { id: "R-3", name: "Spice Route", cuisine: "Indian", rating: 4.8, revenue: 22110, status: "active" },
  { id: "R-4", name: "Patty House", cuisine: "American", rating: 4.6, revenue: 19870, status: "active" },
  { id: "R-5", name: "Sakura Sushi Bar", cuisine: "Japanese", rating: 4.9, revenue: 27650, status: "suspended" },
  { id: "R-6", name: "Green Bowl Co.", cuisine: "Healthy", rating: 4.4, revenue: 9840, status: "active" },
];

const PARTNER_APPLICATIONS = [
  { id: "D-401", name: "Kwame Boateng", vehicle: "Bicycle", submitted: "3 hours ago" },
  { id: "D-402", name: "Sofia Petrova", vehicle: "Scooter", submitted: "1 day ago" },
];

const APPROVED_PARTNERS = [
  { id: "D-1", name: "Diego Marquez", vehicle: "Scooter", rating: 4.9, deliveries: 1284, status: "active" },
  { id: "D-2", name: "Noor Ahmed", vehicle: "Bicycle", rating: 4.8, deliveries: 856, status: "active" },
  { id: "D-3", name: "Liam O'Connor", vehicle: "Car", rating: 4.6, deliveries: 2104, status: "active" },
  { id: "D-4", name: "Yuki Tanaka", vehicle: "Scooter", rating: 4.3, deliveries: 412, status: "suspended" },
];

const PLATFORM_ORDERS = [
  { id: "F-3091", customer: "Sarah Quinn", restaurant: "Patty House", total: 24.5, status: "delivered", date: "2 min ago" },
  { id: "F-3090", customer: "James Ito", restaurant: "Sakura Sushi Bar", total: 41.2, status: "on_the_way", date: "8 min ago" },
  { id: "F-3089", customer: "Priya Nair", restaurant: "Green Bowl Co.", total: 18.9, status: "preparing", date: "14 min ago" },
  { id: "F-3088", customer: "Marcus Bell", restaurant: "Spice Route", total: 33.4, status: "delivered", date: "40 min ago" },
  { id: "F-3087", customer: "Alina Rossi", restaurant: "Basil & Bloom", total: 27.5, status: "cancelled", date: "1 hr ago" },
];

const CATEGORIES = [
  { id: "c1", name: "Fast Food", restaurants: 42 }, { id: "c2", name: "Pizza", restaurants: 28 },
  { id: "c3", name: "Healthy", restaurants: 19 }, { id: "c4", name: "Asian", restaurants: 34 },
  { id: "c5", name: "Indian", restaurants: 22 }, { id: "c6", name: "Desserts", restaurants: 16 },
];

const PLATFORM_OFFERS = [
  { id: "o1", title: "20% off first order", scope: "Platform-wide", active: true, redemptions: 4821 },
  { id: "o2", title: "Free delivery weekends", scope: "Platform-wide", active: true, redemptions: 2190 },
  { id: "o3", title: "Summer pizza fest", scope: "Pizza category", active: false, redemptions: 968 },
];

const ACTIVITY_LOGS = [
  { time: "10:42 AM", actor: "Admin (you)", action: "Approved restaurant application R-498 — Ember Grill" },
  { time: "10:15 AM", actor: "System", action: "Auto-suspended user U-1004 for repeated failed payments" },
  { time: "09:58 AM", actor: "Admin (you)", action: "Deactivated coupon SUMMERFEST" },
  { time: "09:30 AM", actor: "System", action: "Delivery partner D-402 application submitted" },
  { time: "08:47 AM", actor: "Admin (you)", action: "Updated platform commission rate to 18%" },
];

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
function StatCard({ theme, label, value, delta, deltaPositive, icon: Icon }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 20, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={theme.primary} />
        </div>
        {delta && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: deltaPositive ? theme.success : theme.error }}>
            {deltaPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.5 }}>{value}</div>
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
      {count != null && <span style={{ background: active ? "rgba(255,255,255,0.25)" : theme.primarySoft, color: active ? "#fff" : theme.primary, borderRadius: 999, padding: "1px 7px", fontSize: 11 }}>{count}</span>}
    </button>
  );
}

function PrimaryButton({ children, onClick, theme, full, size = "md", icon, variant = "solid" }) {
  const pad = size === "sm" ? "8px 13px" : "11px 18px";
  const fontSize = size === "sm" ? 12 : 13.5;
  const styles = variant === "solid" ? { background: theme.primary, color: "#fff", border: "none" }
    : variant === "outline" ? { background: "transparent", color: theme.text, border: `1px solid ${theme.border}` }
    : variant === "success" ? { background: theme.successSoft, color: theme.success, border: "none" }
    : { background: theme.errorSoft, color: theme.error, border: "none" };
  return (
    <button onClick={onClick} style={{
      padding: pad, fontSize, fontWeight: 700, borderRadius: 11, width: full ? "100%" : "auto", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: FONT_STACK, ...styles,
    }}>
      {icon}{children}
    </button>
  );
}

function Toggle({ on, onClick, theme }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", flexShrink: 0, background: on ? theme.success : theme.border }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s ease" }} />
    </button>
  );
}

function StatusPill({ status, theme }) {
  const map = {
    active: { label: "Active", color: theme.success, soft: theme.successSoft },
    suspended: { label: "Suspended", color: theme.error, soft: theme.errorSoft },
    pending: { label: "Pending", color: theme.warning, soft: theme.warningSoft },
    delivered: { label: "Delivered", color: theme.success, soft: theme.successSoft },
    on_the_way: { label: "On the way", color: theme.primary, soft: theme.primarySoft },
    preparing: { label: "Preparing", color: theme.warning, soft: theme.warningSoft },
    cancelled: { label: "Cancelled", color: theme.error, soft: theme.errorSoft },
  };
  const m = map[status] || map.active;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: m.soft, color: m.color, whiteSpace: "nowrap" }}>{m.label}</span>;
}

function CustomTooltip({ active, payload, label, theme, prefix = "$" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px", boxShadow: theme.shadowSoft }}>
      <div style={{ fontSize: 11.5, color: theme.textMuted, marginBottom: 2 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ fontSize: 13, fontWeight: 700 }}>{p.name || p.dataKey}: {prefix}{p.value.toLocaleString()}</div>
      ))}
    </div>
  );
}

/* =========================================================================
   SIDEBAR + TOPBAR SHELL
   ========================================================================= */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "restaurants", label: "Restaurants", icon: Store },
  { id: "partners", label: "Delivery partners", icon: Bike },
  { id: "orders", label: "Orders", icon: Package },
  { id: "catalog", label: "Categories & offers", icon: Tag },
  { id: "reports", label: "Reports & logs", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ theme, view, setView, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="admin-sidebar-scrim" style={{ position: "fixed", inset: 0, background: theme.overlay, zIndex: 55, display: "none" }} />}
      <aside className={`admin-sidebar ${mobileOpen ? "admin-sidebar-open" : ""}`} style={{
        width: 250, flexShrink: 0, background: theme.sidebar, borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column", padding: "22px 16px", height: "100vh", position: "sticky", top: 0, overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 26 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShieldCheck size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.4 }}>Forkly</div>
            <div style={{ fontSize: 10.5, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.3 }}>ADMIN CONSOLE</div>
          </div>
          <button className="admin-sidebar-close" onClick={() => setMobileOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "none" }}><X size={18} /></button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_ITEMS.map((n) => {
            const Ico = n.icon;
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => { setView(n.id); setMobileOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 11, border: "none",
                background: active ? theme.primarySoft : "transparent", color: active ? theme.primary : theme.textMuted,
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_STACK, textAlign: "left",
              }}>
                <Ico size={16} /> {n.label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", background: theme.cardAlt, borderRadius: 14, padding: 14, border: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>A</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Admin User</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>Super admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ theme, mode, setMode, title, subtitle, setMobileOpen }) {
  const [showNotif, setShowNotif] = useState(false);
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20, background: theme.mode === "dark" ? "rgba(11,15,25,0.85)" : "rgba(251,248,243,0.85)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}`, padding: "16px 26px", display: "flex", alignItems: "center", gap: 16,
    }}>
      <button className="admin-menu-btn" onClick={() => setMobileOpen(true)} style={{ display: "none", background: "none", border: "none", color: theme.text, cursor: "pointer" }}><MenuIcon size={22} /></button>
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1 }} />
      <div className="admin-topbar-search" style={{ display: "flex", alignItems: "center", gap: 8, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 11, padding: "8px 12px", width: 220 }}>
        <Search size={15} color={theme.textMuted} />
        <input placeholder="Search platform…" style={{ border: "none", outline: "none", background: "transparent", color: theme.text, fontSize: 13, width: "100%", fontFamily: FONT_STACK }} />
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
              { t: "3 restaurants awaiting approval", d: "Review pending applications" },
              { t: "Delivery partner application", d: "Sofia Petrova · 1 day ago" },
              { t: "Payout batch processed", d: "$18,240 sent to 342 partners" },
            ].map((n) => (
              <div key={n.t} style={{ padding: "10px 10px", borderRadius: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n.t}</div>
                <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{n.d}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================================================
   DASHBOARD OVERVIEW PAGE
   ========================================================================= */
function DashboardPage({
  theme,
  setView,
  restaurantApps,
  partnerApps,
  platformStats,
}) {
  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <StatCard
  theme={theme}
  label="Platform revenue"
  value={`$${Number(
    platformStats.totalRevenue
  ).toFixed(2)}`}
  icon={DollarSign}
/>

<StatCard
  theme={theme}
  label="Total customers"
  value={platformStats.totalUsers.toLocaleString()}
  icon={Users}
/>

<StatCard
  theme={theme}
  label="Active restaurants"
  value={platformStats.totalRestaurants}
  icon={Store}
/>

<StatCard
  theme={theme}
  label="Active delivery partners"
  value={platformStats.totalDeliveryPartners}
  icon={Bike}
/>

<StatCard
  theme={theme}
  label="Total orders"
  value={platformStats.totalOrders.toLocaleString()}
  icon={Package}
/>
      </div>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Platform revenue &amp; orders</div>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Last 12 months</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={REVENUE_TREND}>
            <defs>
              <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
                <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: theme.textMuted, fontSize: 11.5 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.textMuted, fontSize: 11.5 }} axisLine={false} tickLine={false} width={46} />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Area type="monotone" dataKey="revenue" stroke={theme.primary} strokeWidth={2.5} fill="url(#adminRevGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="admin-dash-grid">
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>New signups this week</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={SIGNUP_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: theme.textMuted, fontSize: 11.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.textMuted, fontSize: 11.5 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip theme={theme} prefix="" />} />
              <Bar dataKey="users" name="Users" fill={theme.primary} radius={[6, 6, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Pending approvals</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setView("restaurants")} style={{ display: "flex", alignItems: "center", gap: 12, background: theme.warningSoft, border: "none", borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT_STACK, textAlign: "left" }}>
              <Store size={17} color={theme.warning} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{restaurantApps.length} restaurant applications</span>
              <ChevronRight size={15} color={theme.textMuted} />
            </button>
            <button onClick={() => setView("partners")} style={{ display: "flex", alignItems: "center", gap: 12, background: theme.warningSoft, border: "none", borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT_STACK, textAlign: "left" }}>
              <Bike size={17} color={theme.warning} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{partnerApps.length} delivery partner applications</span>
              <ChevronRight size={15} color={theme.textMuted} />
            </button>
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Recent activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVITY_LOGS.slice(0, 3).map((l, i) => (
                <div key={i} style={{ fontSize: 12, color: theme.textMuted, display: "flex", gap: 8 }}>
                  <span style={{ color: theme.textFaint, whiteSpace: "nowrap" }}>{l.time}</span>
                  <span>{l.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   USERS PAGE
   ========================================================================= */
function UsersPage({ theme, users, onToggleStatus }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "10px 14px" }}>
          <Search size={16} color={theme.textMuted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" style={{ border: "none", outline: "none", background: "transparent", color: theme.text, fontSize: 13.5, width: "100%", fontFamily: FONT_STACK }} />
        </div>
        <Chip theme={theme} active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</Chip>
        <Chip theme={theme} active={statusFilter === "active"} onClick={() => setStatusFilter("active")}>Active</Chip>
        <Chip theme={theme} active={statusFilter === "suspended"} onClick={() => setStatusFilter("suspended")}>Suspended</Chip>
      </div>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3, background: theme.cardAlt }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>User</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Joined</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Orders</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={u.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: 11.5, color: theme.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", color: theme.textMuted }}>{u.joined}</td>
                  <td style={{ padding: "12px 10px" }}>{u.orders}</td>
                  <td style={{ padding: "12px 10px" }}><StatusPill status={u.status} theme={theme} /></td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {u.status === "active" ? (
                      <PrimaryButton theme={theme} size="sm" variant="danger" icon={<Ban size={12} />} onClick={() => onToggleStatus(u.id)}>Suspend</PrimaryButton>
                    ) : (
                      <PrimaryButton theme={theme} size="sm" variant="success" icon={<UserCheck size={12} />} onClick={() => onToggleStatus(u.id)}>Reactivate</PrimaryButton>
                    )}
                  </td>
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
   RESTAURANTS PAGE
   ========================================================================= */
function RestaurantsPage({ theme, applications, onApprove, onReject, restaurants, onToggleStatus }) {
  return (
    <div style={{ padding: 26 }}>
      {applications.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} color={theme.warning} /> Pending applications ({applications.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {applications.map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, flexWrap: "wrap" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: theme.warningSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Store size={19} color={theme.warning} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{a.cuisine} · Owner: {a.owner} · Submitted {a.submitted}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <PrimaryButton theme={theme} size="sm" variant="danger" icon={<X size={13} />} onClick={() => onReject(a.id)}>Reject</PrimaryButton>
                  <PrimaryButton theme={theme} size="sm" icon={<Check size={13} />} onClick={() => onApprove(a.id)}>Approve</PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>All restaurants ({restaurants.length})</div>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3, background: theme.cardAlt }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Restaurant</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Cuisine</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Rating</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Revenue</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>{r.name}</td>
                  <td style={{ padding: "12px 10px", color: theme.textMuted }}>{r.cuisine}</td>
                  <td style={{ padding: "12px 10px" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color={theme.accent} fill={theme.accent} /> {r.rating}</span></td>
                  <td style={{ padding: "12px 10px", fontWeight: 700 }}>${r.revenue.toLocaleString()}</td>
                  <td style={{ padding: "12px 10px" }}><StatusPill status={r.status} theme={theme} /></td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {r.status === "active" ? (
                      <PrimaryButton theme={theme} size="sm" variant="danger" icon={<Ban size={12} />} onClick={() => onToggleStatus(r.id)}>Suspend</PrimaryButton>
                    ) : (
                      <PrimaryButton theme={theme} size="sm" variant="success" icon={<RotateCcw size={12} />} onClick={() => onToggleStatus(r.id)}>Reinstate</PrimaryButton>
                    )}
                  </td>
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
   DELIVERY PARTNERS PAGE
   ========================================================================= */
function PartnersPage({ theme, applications, onApprove, onReject, partners, onToggleStatus }) {
  return (
    <div style={{ padding: 26 }}>
      {applications.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} color={theme.warning} /> Pending applications ({applications.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {applications.map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, flexWrap: "wrap" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: theme.warningSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bike size={19} color={theme.warning} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{a.vehicle} · Submitted {a.submitted}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <PrimaryButton theme={theme} size="sm" variant="danger" icon={<X size={13} />} onClick={() => onReject(a.id)}>Reject</PrimaryButton>
                  <PrimaryButton theme={theme} size="sm" icon={<Check size={13} />} onClick={() => onApprove(a.id)}>Approve</PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>All delivery partners ({partners.length})</div>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3, background: theme.cardAlt }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Partner</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Vehicle</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Rating</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Deliveries</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>{p.name}</td>
                  <td style={{ padding: "12px 10px", color: theme.textMuted }}>{p.vehicle}</td>
                  <td style={{ padding: "12px 10px" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color={theme.accent} fill={theme.accent} /> {p.rating}</span></td>
                  <td style={{ padding: "12px 10px" }}>{p.deliveries.toLocaleString()}</td>
                  <td style={{ padding: "12px 10px" }}><StatusPill status={p.status} theme={theme} /></td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {p.status === "active" ? (
                      <PrimaryButton theme={theme} size="sm" variant="danger" icon={<Ban size={12} />} onClick={() => onToggleStatus(p.id)}>Suspend</PrimaryButton>
                    ) : (
                      <PrimaryButton theme={theme} size="sm" variant="success" icon={<RotateCcw size={12} />} onClick={() => onToggleStatus(p.id)}>Reinstate</PrimaryButton>
                    )}
                  </td>
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
   ORDERS PAGE (platform-wide log)
   ========================================================================= */
function OrdersPage({ theme, orders }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const STATUS_LABELS = { all: "All orders", preparing: "Preparing", on_the_way: "On the way", delivered: "Delivered", cancelled: "Cancelled" };

  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {Object.keys(STATUS_LABELS).map((s) => (
          <Chip key={s} theme={theme} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{STATUS_LABELS[s]}</Chip>
        ))}
      </div>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.textMuted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3, background: theme.cardAlt }}>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Order</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Customer</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Restaurant</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Total</th>
                <th style={{ padding: "12px 10px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} style={{ borderTop: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>#{o.id}</td>
                  <td style={{ padding: "12px 10px" }}>{o.customer}</td>
                  <td style={{ padding: "12px 10px", color: theme.textMuted }}>{o.restaurant}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                  <td style={{ padding: "12px 10px" }}><StatusPill status={o.status} theme={theme} /></td>
                  <td style={{ padding: "12px 16px", color: theme.textMuted }}>{o.date}</td>
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
   CATALOG PAGE (Categories + Offers)
   ========================================================================= */
function CatalogPage({ theme, categories, offers, onToggleOffer, onAddCategory }) {
  const [subTab, setSubTab] = useState("categories");
  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Chip theme={theme} active={subTab === "categories"} onClick={() => setSubTab("categories")}>Categories</Chip>
        <Chip theme={theme} active={subTab === "offers"} onClick={() => setSubTab("offers")}>Offers &amp; coupons</Chip>
      </div>

      {subTab === "categories" ? (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <PrimaryButton theme={theme} size="sm" icon={<Plus size={13} />} onClick={onAddCategory}>Add category</PrimaryButton>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="admin-cat-grid">
            {categories.map((c) => (
              <div key={c.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
                  <button style={{ background: "none", border: "none", color: theme.textFaint, cursor: "pointer" }}><Pencil size={14} /></button>
                </div>
                <div style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 6 }}>{c.restaurants} restaurants</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {offers.map((o) => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 16, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18, opacity: o.active ? 1 : 0.55 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={19} color={theme.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.title}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{o.scope}</div>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{o.redemptions.toLocaleString()}</div>
                <div style={{ fontSize: 10.5, color: theme.textMuted }}>Redemptions</div>
              </div>
              <Toggle on={o.active} onClick={() => onToggleOffer(o.id)} theme={theme} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   REPORTS & LOGS PAGE
   ========================================================================= */
function ReportsPage({ theme }) {
  return (
    <div style={{ padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: theme.textMuted, fontSize: 13.5 }}>Recent platform activity</div>
        <PrimaryButton theme={theme} size="sm" variant="outline" icon={<Download size={13} />}>Export CSV</PrimaryButton>
      </div>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 8 }}>
        {ACTIVITY_LOGS.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "14px 14px", borderTop: i === 0 ? "none" : `1px solid ${theme.border}` }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: theme.cardAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={15} color={theme.textMuted} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{l.action}</div>
              <div style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 3 }}>{l.actor} · {l.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SETTINGS PAGE
   ========================================================================= */
function SettingsPage({ theme }) {
  const [commission, setCommission] = useState(18);
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: 26, maxWidth: 620 }}>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Platform settings</div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: theme.textMuted }}>Commission rate (%)</label>
          <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} style={{ width: "100%", marginTop: 6, background: theme.cardAlt, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "11px 14px", color: theme.text, fontSize: 14, outline: "none", fontFamily: FONT_STACK }} />
        </div>
        {[
          { label: "Require restaurant approval before going live", on: true },
          { label: "Require delivery partner document verification", on: true },
          { label: "Auto-suspend after 5 failed payments", on: false },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
            <Toggle on={s.on} onClick={() => {}} theme={theme} />
          </div>
        ))}
        <div style={{ marginTop: 18 }}>
          <PrimaryButton theme={theme} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }} icon={saved ? <Check size={14} /> : null}>
            {saved ? "Saved" : "Save changes"}
          </PrimaryButton>
        </div>
      </div>

      <div style={{ background: theme.errorSoft, border: `1px solid ${theme.error}33`, borderRadius: 18, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: theme.error, marginBottom: 8 }}>
          <ShieldAlert size={16} /> Danger zone
        </div>
        <p style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 14 }}>These actions affect the entire platform and cannot be undone.</p>
        <PrimaryButton theme={theme} variant="danger">Enable maintenance mode</PrimaryButton>
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
      input:focus, select:focus, button:focus-visible { outline: 2px solid ${theme.primary}; outline-offset: 1px; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 8px; }
      @keyframes admin-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .admin-page-enter { animation: admin-fade .3s ease; }

      @media (max-width: 1080px) {
        .admin-dash-grid { grid-template-columns: 1fr !important; }
        .admin-cat-grid { grid-template-columns: repeat(2,1fr) !important; }
      }
      @media (max-width: 860px) {
        .admin-sidebar { position: fixed !important; left: -260px; top: 0; z-index: 60; transition: left .25s ease; }
        .admin-sidebar-open { left: 0 !important; box-shadow: 20px 0 50px rgba(0,0,0,0.3); }
        .admin-sidebar-scrim { display: block !important; }
        .admin-sidebar-close { display: flex !important; }
        .admin-menu-btn { display: flex !important; }
        .admin-topbar-search { display: none !important; }
        .admin-cat-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

function mapRestaurantApplication(
  application
) {
  return {
    id: application.id,
    name: application.name,
    cuisine: application.cuisine,
    owner:
      application.owner?.name ||
      application.owner?.email ||
      "Restaurant owner",
    submitted: new Date(
      application.createdAt
    ).toLocaleDateString(),
  };
}

function mapPartnerApplication(application) {
  return {
    id: application.id,
    name:
      application.user?.name ||
      application.user?.email ||
      "Delivery partner",
    vehicle:
      application.vehicleType ||
      "Vehicle not specified",
    submitted: new Date(
      application.createdAt
    ).toLocaleDateString(),
  };
}

function mapAdminUser(user) {
  return {
    id: user.id,
    name: user.name || "Unnamed user",
    email: user.email || "No email",
    avatar: user.avatarUrl || IMG.a2,
    orders: user._count?.orders || 0,
    status: user.isActive ? "active" : "suspended",
    joined: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",
  };
}
function mapAdminRestaurant(restaurant) {
  const deliveredOrders = Array.isArray(restaurant.orders)
    ? restaurant.orders
    : [];

  return {
    id: restaurant.id,
    name: restaurant.name || "Unnamed restaurant",
    cuisine: restaurant.cuisine || "Not specified",
    rating: Number(restaurant.avgRating || 0),
    revenue: deliveredOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    ),
    status: String(
      restaurant.status || "PENDING"
    ).toLowerCase(),
  };
}
function mapAdminPartner(partner) {
  return {
    id: partner.id,
    name:
      partner.user?.name ||
      partner.user?.email ||
      "Unnamed delivery partner",
    email: partner.user?.email || "No email",
    vehicle: partner.vehicleType || "Not specified",
    rating: Number(partner.rating || 0),
    deliveries: Number(partner.totalDeliveries || 0),
    status: String(
      partner.status || "PENDING"
    ).toLowerCase(),
  };
}

function mapAdminOrder(order) {
  return {
    id: order.orderNumber || order.id,
    backendId: order.id,
    customer:
      order.user?.name || "Unknown customer",
    restaurant:
      order.restaurant?.name || "Unknown restaurant",
    total: Number(order.total || 0),
    status: String(
      order.status || "PENDING"
    ).toLowerCase(),
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "—",
  };
}
function mapAdminCategory(category) {
  return {
    id: category.id,
    name: category.name || "Unnamed category",
    icon: category.icon || null,
    restaurants: Number(
      category.restaurantCount || 0
    ),
  };
}

function mapAdminOffer(offer) {
  const scopeLabel = offer.scope
    ? `${offer.scope
        .charAt(0)
        .toUpperCase()}${offer.scope.slice(1)}`
    : "Platform";

  return {
    id: offer.id,
    title: offer.title || "Untitled offer",
    scope: scopeLabel,
    active: Boolean(offer.isActive),
    redemptions: Number(
      offer.redemptions || 0
    ),
  };
}
function App() {
  const [mode, setMode] = useState("dark");
  const theme = THEMES[mode];
  const [view, setView] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(
  () => getSavedAdmin()
);

  const [users, setUsers] = useState([]);
  const [restaurantApps, setRestaurantApps] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [partnerApps, setPartnerApps] = useState([]);
  const [partners, setPartners] = useState([]);
  const [platformOrders, setPlatformOrders] =
  useState([]);
 const [categories, setCategories] = useState([]);
const [offers, setOffers] = useState([]);
  useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  async function loadUsers() {
    try {
      const response = await getAdminUsers();

      const userList = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!cancelled) {
        setUsers(userList.map(mapAdminUser));
      }
    } catch (error) {
      console.error("Unable to load admin users:", error);
    }
  }

  loadUsers();

  return () => {
    cancelled = true;
  };
}, [adminUser]);
useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  async function loadRestaurants() {
    try {
      const response = await getAdminRestaurants();

      const restaurantList = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!cancelled) {
        setRestaurants(
          restaurantList
            .filter(
              (restaurant) =>
                restaurant.status !== "PENDING"
            )
            .map(mapAdminRestaurant)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load admin restaurants:",
        error
      );
    }
  }

  loadRestaurants();

  return () => {
    cancelled = true;
  };
}, [adminUser]);
useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  async function loadPartners() {
    try {
      const response = await getAdminPartners();

      const partnerList = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!cancelled) {
        setPartners(
          partnerList
            .filter(
              (partner) =>
                partner.status !== "PENDING"
            )
            .map(mapAdminPartner)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load admin delivery partners:",
        error
      );
    }
  }

  loadPartners();

  return () => {
    cancelled = true;
  };
}, [adminUser]);
useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  async function loadOrders() {
    try {
      const response = await getAdminOrders();

      const orderList = Array.isArray(response)
        ? response
        : response?.data || [];

      if (!cancelled) {
        setPlatformOrders(
          orderList.map(mapAdminOrder)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load admin orders:",
        error
      );
    }
  }

  loadOrders();

  return () => {
    cancelled = true;
  };
}, [adminUser]);
useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  async function loadCatalog() {
    try {
      const [
        categoryResponse,
        offerResponse,
      ] = await Promise.all([
        getAdminCategories(),
        getAdminOffers(),
      ]);

      const categoryList = Array.isArray(
        categoryResponse
      )
        ? categoryResponse
        : categoryResponse?.data || [];

      const offerList = Array.isArray(
        offerResponse
      )
        ? offerResponse
        : offerResponse?.data || [];

      if (!cancelled) {
        setCategories(
          categoryList.map(mapAdminCategory)
        );

        setOffers(
          offerList.map(mapAdminOffer)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load Admin catalog:",
        error
      );
    }
  }

  loadCatalog();

  return () => {
    cancelled = true;
  };
}, [adminUser]);
  const [platformStats, setPlatformStats] =
  useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalRestaurants: 0,
    totalDeliveryPartners: 0,
    totalOrders: 0,
  });
  const handleAdminLogin = async (
  email,
  password
) => {
  const user = await loginAdmin(email, password);
  setAdminUser(user);
};



  const toggleUserStatus = async (id) => {
  const user = users.find((item) => item.id === id);

  if (!user) return;

  const shouldBeActive = user.status !== "active";

  try {
    await setAdminUserActive(id, shouldBeActive);

    setUsers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: shouldBeActive ? "active" : "suspended",
            }
          : item
      )
    );
  } catch (error) {
    alert(error.message || "Unable to update user status");
  }
};
  const toggleRestaurantStatus = async (id) => {
  const restaurant = restaurants.find(
    (item) => item.id === id
  );

  if (!restaurant) return;

  const nextStatus =
    restaurant.status === "active"
      ? "SUSPENDED"
      : "ACTIVE";

  try {
    await setAdminRestaurantStatus(id, nextStatus);

    setRestaurants((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus.toLowerCase(),
            }
          : item
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update restaurant status"
    );
  }
};
  const togglePartnerStatus = async (id) => {
  const partner = partners.find(
    (item) => item.id === id
  );

  if (!partner) return;

  const nextStatus =
    partner.status === "active"
      ? "SUSPENDED"
      : "ACTIVE";

  try {
    await setAdminPartnerStatus(id, nextStatus);

    setPartners((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus.toLowerCase(),
            }
          : item
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update delivery partner status"
    );
  }
};
  const toggleOffer = async (id) => {
  try {
    await toggleAdminOffer(id);

    setOffers((current) =>
      current.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              active: !offer.active,
            }
          : offer
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to update the offer"
    );
  }
};

  const approveRestaurant = async (id) => {
  try {
    await reviewRestaurantApplication(
      id,
      true
    );

    setRestaurantApps((current) =>
      current.filter(
        (application) =>
          application.id !== id
      )
    );

    alert("Restaurant approved successfully");
  } catch (error) {
    alert(
      error.message ||
        "Unable to approve restaurant"
    );
  }
};

const rejectRestaurant = async (id) => {
  try {
    await reviewRestaurantApplication(
      id,
      false
    );

    setRestaurantApps((current) =>
      current.filter(
        (application) =>
          application.id !== id
      )
    );

    alert("Restaurant application rejected");
  } catch (error) {
    alert(
      error.message ||
        "Unable to reject restaurant"
    );
  }
};

const approvePartner = async (id) => {
  try {
    await reviewPartnerApplication(
      id,
      true
    );

    setPartnerApps((current) =>
      current.filter(
        (application) =>
          application.id !== id
      )
    );

    alert(
      "Delivery partner approved successfully"
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to approve delivery partner"
    );
  }
};

const rejectPartner = async (id) => {
  try {
    await reviewPartnerApplication(
      id,
      false
    );

    setPartnerApps((current) =>
      current.filter(
        (application) =>
          application.id !== id
      )
    );

    alert(
      "Delivery partner application rejected"
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to reject delivery partner"
    );
  }
};
  const addCategory = async () => {
  const name = window.prompt(
    "Enter the new category name"
  );

  if (!name || !name.trim()) return;

  try {
    const response = await createAdminCategory({
      name: name.trim(),
    });

    const createdCategory =
      response?.data || response;

    setCategories((current) =>
      [
        ...current,
        mapAdminCategory({
          ...createdCategory,
          restaurantCount: 0,
        }),
      ].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
  } catch (error) {
    alert(
      error.message ||
        "Unable to create category"
    );
  }
};

  useEffect(() => {
  if (!adminUser) return;

  let cancelled = false;

  const loadApplications = async () => {
    try {
      const [
  restaurantData,
  partnerData,
  statsData,
] = await Promise.all([
  getRestaurantApplications(),
  getPartnerApplications(),
  getAdminStats(),
]);

      if (cancelled) return;

      setPlatformStats({
  totalRevenue: Number(
    statsData?.totalRevenue || 0
  ),
  totalUsers:
    statsData?.totalUsers || 0,
  totalRestaurants:
    statsData?.totalRestaurants || 0,
  totalDeliveryPartners:
    statsData?.totalDeliveryPartners || 0,
  totalOrders:
    statsData?.totalOrders || 0,
});

      setRestaurantApps(
        (restaurantData || []).map(
          mapRestaurantApplication
        )
      );

      setPartnerApps(
        (partnerData || []).map(
          mapPartnerApplication
        )
      );
    } catch (error) {
      console.error(
        "Unable to load admin applications:",
        error
      );
    }
  };

  loadApplications();

  return () => {
    cancelled = true;
  };
}, [adminUser]);

  if (!adminUser) {
  return (
    <PortalLogin
      portalName="Admin Console"
      description="Sign in to manage users, restaurants, delivery partners and platform operations."
      demoEmail="admin@forkly.dev"
      demoPassword="Admin123!"
      onLogin={handleAdminLogin}
    />
  );
}
  const TITLES = {
    dashboard: ["Dashboard", "Platform-wide overview and key metrics"],
    users: ["Users", "Manage customer accounts"],
    restaurants: ["Restaurants", "Approve applications and manage partner restaurants"],
    partners: ["Delivery partners", "Approve applications and manage active couriers"],
    orders: ["Orders", "Platform-wide order log"],
    catalog: ["Categories & offers", "Manage cuisine categories and platform promotions"],
    reports: ["Reports & logs", "Audit trail of admin and system activity"],
    settings: ["Settings", "Platform-wide configuration"],
  };

  let page = null;
  if (view === "dashboard")
  page = (
    <DashboardPage
      theme={theme}
      setView={setView}
      restaurantApps={restaurantApps}
      partnerApps={partnerApps}
      platformStats={platformStats}
    />
  );
  else if (view === "users") page = <UsersPage theme={theme} users={users} onToggleStatus={toggleUserStatus} />;
  else if (view === "restaurants") page = <RestaurantsPage theme={theme} applications={restaurantApps} onApprove={approveRestaurant} onReject={rejectRestaurant} restaurants={restaurants} onToggleStatus={toggleRestaurantStatus} />;
  else if (view === "partners") page = <PartnersPage theme={theme} applications={partnerApps} onApprove={approvePartner} onReject={rejectPartner} partners={partners} onToggleStatus={togglePartnerStatus} />;
  else if (view === "orders") page = <OrdersPage theme={theme} orders={platformOrders} />;
  else if (view === "catalog") page = <CatalogPage theme={theme} categories={categories} offers={offers} onToggleOffer={toggleOffer} onAddCategory={addCategory} />;
  else if (view === "reports") page = <ReportsPage theme={theme} />;
  else if (view === "settings") page = <SettingsPage theme={theme} />;

  return (
    <div style={{ display: "flex", background: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: FONT_STACK }}>
      <GlobalStyles theme={theme} />
      <Sidebar theme={theme} view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar theme={theme} mode={mode} setMode={setMode} title={TITLES[view][0]} subtitle={TITLES[view][1]} setMobileOpen={setMobileOpen} />
        <div key={view} className="admin-page-enter">{page}</div>
      </div>
    </div>
  );
}

export default App;
