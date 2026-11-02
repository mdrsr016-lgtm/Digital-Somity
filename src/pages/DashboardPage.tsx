import React, { useState, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building2,
  PieChart,
  FileText,
  Shield,
  Crown,
  Briefcase,
  BadgeDollarSign,
  UserCheck,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  labelBn: string;
};

// ─── Role-based nav configs ──────────────────────────────────────────────────
const NAV_BY_ROLE: Record<string, NavItem[]> = {
  founder: [
    { id: "home", icon: <Home size={20} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "branches", icon: <Building2 size={20} />, label: "Branches", labelBn: "শাখাসমূহ" },
    { id: "members", icon: <Users size={20} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "finance", icon: <TrendingUp size={20} />, label: "Finance", labelBn: "অর্থায়ন" },
    { id: "reports", icon: <FileText size={20} />, label: "Reports", labelBn: "প্রতিবেদন" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings", labelBn: "সেটিংস" },
  ],
  admin: [
    { id: "home", icon: <Home size={20} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "members", icon: <Users size={20} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "finance", icon: <TrendingUp size={20} />, label: "Finance", labelBn: "অর্থায়ন" },
    { id: "reports", icon: <FileText size={20} />, label: "Reports", labelBn: "প্রতিবেদন" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings", labelBn: "সেটিংস" },
  ],
  manager: [
    { id: "home", icon: <Home size={20} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "members", icon: <Users size={20} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "transactions", icon: <CreditCard size={20} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "reports", icon: <FileText size={20} />, label: "Reports", labelBn: "প্রতিবেদন" },
  ],
  cashier: [
    { id: "home", icon: <Home size={20} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "transactions", icon: <CreditCard size={20} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "members", icon: <Users size={20} />, label: "Members", labelBn: "সদস্যগণ" },
  ],
  investor: [
    { id: "home", icon: <Home size={20} />, label: "Portfolio", labelBn: "পোর্টফোলিও" },
    { id: "finance", icon: <PieChart size={20} />, label: "Returns", labelBn: "আয়" },
    { id: "transactions", icon: <CreditCard size={20} />, label: "Transactions", labelBn: "লেনদেন" },
  ],
  member: [
    { id: "home", icon: <Home size={20} />, label: "My Account", labelBn: "আমার অ্যাকাউন্ট" },
    { id: "transactions", icon: <CreditCard size={20} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "finance", icon: <Wallet size={20} />, label: "Savings", labelBn: "সঞ্চয়" },
  ],
};

// ─── Role badge icon ─────────────────────────────────────────────────────────
const RoleIcon: React.FC<{ role: string; color: string }> = ({ role, color }) => {
  const icons: Record<string, React.ReactNode> = {
    founder: <Crown size={14} />,
    admin: <Shield size={14} />,
    manager: <Briefcase size={14} />,
    cashier: <BadgeDollarSign size={14} />,
    investor: <TrendingUp size={14} />,
    member: <UserCheck size={14} />,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color,
        fontSize: 11,
        fontWeight: 600,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 999,
        padding: "2px 8px",
      }}
    >
      {icons[role]}
    </span>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}> = ({ label, value, sub, icon, accent }) => (
  <div
    style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      flex: "1 1 140px",
      minWidth: 0,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-md)",
          background: `${accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
    </div>
    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{sub}</div>}
  </div>
);

// ─── Transaction Row ─────────────────────────────────────────────────────────
const TxRow: React.FC<{ name: string; amount: string; type: "in" | "out"; date: string }> = ({
  name,
  amount,
  type,
  date,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid var(--color-border-subtle)",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-md)",
        background: type === "in" ? "var(--color-success-soft)" : "var(--color-error-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: type === "in" ? "var(--color-success)" : "var(--color-error)",
        flexShrink: 0,
      }}
    >
      {type === "in" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{date}</div>
    </div>
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: type === "in" ? "var(--color-success)" : "var(--color-error)",
        flexShrink: 0,
      }}
    >
      {type === "in" ? "+" : "-"}৳{amount}
    </div>
  </div>
);

// ─── Role-specific home content ───────────────────────────────────────────────
const HomeContent: React.FC<{ role: string; user: { name: string; balance?: number; workspace_name: string; role_color: string } }> = ({
  role,
  user,
}) => {
  const balance = user.balance ?? 0;
  const fmt = (n: number) => n.toLocaleString("en-BD");

  // Shared recent transactions (demo)
  const recentTxs = [
    { name: "Monthly Deposit", amount: "5,000", type: "in" as const, date: "Today, 10:30 AM" },
    { name: "Loan Disbursement", amount: "25,000", type: "out" as const, date: "Yesterday, 3:15 PM" },
    { name: "Member Contribution", amount: "2,500", type: "in" as const, date: "Nov 1, 9:00 AM" },
    { name: "Utility Payment", amount: "1,200", type: "out" as const, date: "Oct 30, 11:45 AM" },
  ];

  if (role === "founder") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Balance" value={`৳${fmt(balance)}`} sub="All branches" icon={<Wallet size={16} />} accent="#9333EA" />
          <StatCard label="Total Members" value="1,248" sub="+12 this month" icon={<Users size={16} />} accent="#0F5BE4" />
          <StatCard label="Active Branches" value="7" sub="2 pending" icon={<Building2 size={16} />} accent="#10B981" />
          <StatCard label="Monthly Revenue" value="৳3.2L" sub="+8.4% vs last" icon={<TrendingUp size={16} />} accent="#EA580C" />
        </div>
        <SectionCard title="Recent Transactions">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "admin") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="HQ Balance" value={`৳${fmt(balance)}`} sub="Current" icon={<Wallet size={16} />} accent="#16A34A" />
          <StatCard label="Total Members" value="1,248" sub="+12 this month" icon={<Users size={16} />} accent="#0F5BE4" />
          <StatCard label="Pending Tasks" value="5" sub="Needs review" icon={<FileText size={16} />} accent="#EA580C" />
          <StatCard label="This Month" value="৳1.8L" sub="Collected" icon={<TrendingUp size={16} />} accent="#10B981" />
        </div>
        <SectionCard title="Recent Transactions">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "manager") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Branch Balance" value={`৳${fmt(balance)}`} sub={user.workspace_name} icon={<Building2 size={16} />} accent="#1D4ED8" />
          <StatCard label="Branch Members" value="186" sub="+3 this week" icon={<Users size={16} />} accent="#0F5BE4" />
          <StatCard label="Collections" value="৳42,500" sub="This month" icon={<TrendingUp size={16} />} accent="#10B981" />
          <StatCard label="Pending Loans" value="8" sub="Review needed" icon={<FileText size={16} />} accent="#EA580C" />
        </div>
        <SectionCard title="Recent Transactions">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "cashier") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Today Collected" value="৳18,500" sub="12 transactions" icon={<BadgeDollarSign size={16} />} accent="#1D4ED8" />
          <StatCard label="Today Disbursed" value="৳9,000" sub="4 transactions" icon={<ArrowUpRight size={16} />} accent="#EA580C" />
          <StatCard label="Pending" value="3" sub="Awaiting approval" icon={<FileText size={16} />} accent="#F59E0B" />
        </div>
        <SectionCard title="Today's Transactions">
          {recentTxs.slice(0, 3).map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "investor") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Portfolio Value" value={`৳${fmt(balance)}`} sub="Total invested" icon={<PieChart size={16} />} accent="#EA580C" />
          <StatCard label="Monthly Return" value="৳8,500" sub="+12.4% ROI" icon={<TrendingUp size={16} />} accent="#10B981" />
          <StatCard label="Active Plans" value="2" sub="Running" icon={<Briefcase size={16} />} accent="#0F5BE4" />
        </div>
        <SectionCard title="Investment History">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  // member (default)
  return (
    <>
      {/* Balance Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F5BE4 0%, #041B45 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 20px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>My Savings Balance</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: 4 }}>
          ৳{fmt(balance)}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{user.workspace_name}</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard label="This Month" value="৳5,000" sub="Deposited" icon={<ArrowDownLeft size={16} />} accent="#10B981" />
        <StatCard label="Total Saved" value={`৳${fmt(balance)}`} sub="Lifetime" icon={<Wallet size={16} />} accent="#0F5BE4" />
      </div>
      <SectionCard title="My Transactions">
        {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
      </SectionCard>
    </>
  );
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px",
      marginBottom: 16,
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {title}
      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand)", fontSize: 12, display: "flex", alignItems: "center", gap: 2 }}>
        See all <ChevronRight size={12} />
      </button>
    </div>
    {children}
  </div>
);

// ─── Placeholder content for other tabs ──────────────────────────────────────
const PlaceholderContent: React.FC<{ tab: string }> = ({ tab }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      gap: 12,
      color: "var(--color-text-muted)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 40 }}>🚧</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-secondary)" }}>Coming Soon</div>
    <div style={{ fontSize: 13 }}>
      The <strong>{tab}</strong> section is being built.
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Sliding pill refs & state ──
  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Measure only when activeTab changes — avoids infinite render loop
  useLayoutEffect(() => {
    const role = currentUser?.role ?? "member";
    const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.member;
    const idx = items.findIndex((n) => n.id === activeTab);
    const btn = btnRefs.current[idx];
    const nav = navRef.current;
    if (!btn || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({ left: btnRect.left - navRect.left, width: btnRect.width, ready: true });
  }, [activeTab, currentUser?.role]); // ← dependency array stops infinite loop

  if (!currentUser) return null;

  const navItems = NAV_BY_ROLE[currentUser.role] ?? NAV_BY_ROLE.member;
  const activeNavItem = navItems.find((n) => n.id === activeTab) ?? navItems[0];

  return (
    <div
      className="mobile-shell"
      style={{ background: "var(--color-bg)", display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: Avatar + Greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${currentUser.role_color}`,
              flexShrink: 0,
              background: currentUser.role_color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              currentUser.initial
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
              {currentUser.name}
            </div>
            <RoleIcon role={currentUser.role} color={currentUser.role_color} />
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <IconBtn onClick={toggleLanguage} title="Toggle language">
            <Globe size={17} />
          </IconBtn>
          <IconBtn onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </IconBtn>
          <IconBtn title="Notifications">
            <Bell size={17} />
          </IconBtn>
          <IconBtn onClick={() => setDrawerOpen(true)} title="Menu">
            <Menu size={17} />
          </IconBtn>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "16px", WebkitOverflowScrolling: "touch" }}>
        {/* Page title */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: "var(--size-section-heading)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            {language === "bn" ? activeNavItem.labelBn : activeNavItem.label}
          </h2>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "2px 0 0" }}>
            {currentUser.workspace_name}
          </p>
        </div>

        {activeTab === "home" ? (
          <HomeContent role={currentUser.role} user={currentUser} />
        ) : (
          <PlaceholderContent tab={language === "bn" ? activeNavItem.labelBn : activeNavItem.label} />
        )}
      </main>

      {/* ── Bottom Navigation ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
          background: "var(--color-bg)",
        }}
      >
        {/* The nav is a plain div so we can ref it */}
        <div
          ref={navRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 999,
            padding: "6px 8px",
            gap: 4,
            boxShadow: "var(--shadow-card)",
            position: "relative",
          }}
        >
          {/* ── Single sliding pill — lives outside buttons, z:0 ── */}
          <motion.div
            animate={{
              left: pill.left,
              width: pill.width,
              opacity: pill.ready ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.9 }}
            style={{
              position: "absolute",
              top: 6,
              height: "calc(100% - 12px)",
              borderRadius: 999,
              background: "var(--color-text-primary)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* ── Tab buttons — transparent, pill sits behind them ── */}
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => { btnRefs.current[idx] = el; }}
                onClick={() => setActiveTab(item.id)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isActive ? 7 : 0,
                  padding: isActive ? "9px 16px" : "9px 10px",
                  border: "none",
                  borderRadius: 999,
                  background: "transparent",
                  color: isActive ? "var(--color-bg)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  flexShrink: isActive ? 0 : 1,
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  transition: "color 180ms ease",
                  outline: "none",
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                  }}
                >
                  {item.icon}
                </span>

                {/* Label: shown instantly when active so measurement is correct */}
                {isActive && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {language === "bn" ? item.labelBn : item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Side Drawer (Menu) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--overlay-bg)",
              zIndex: 40,
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "72%",
              maxWidth: 280,
              background: "var(--color-surface)",
              borderLeft: "1px solid var(--color-border)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              padding: "0 0 24px",
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                Menu
              </span>
              <IconBtn onClick={() => setDrawerOpen(false)}>
                <X size={18} />
              </IconBtn>
            </div>

            {/* Profile summary */}
            <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${currentUser.role_color}`,
                    background: currentUser.role_color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    currentUser.initial
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>{currentUser.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{currentUser.login_id}</div>
                  <RoleIcon role={currentUser.role} color={currentUser.role_color} />
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setDrawerOpen(false); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 12px",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: activeTab === item.id ? "var(--color-brand-soft)" : "none",
                    color: activeTab === item.id ? "var(--color-brand)" : "var(--color-text-secondary)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: activeTab === item.id ? 600 : 400,
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                >
                  {item.icon}
                  {language === "bn" ? item.labelBn : item.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div style={{ padding: "0 8px" }}>
              <button
                onClick={() => { logout(); setDrawerOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 12px",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-error-soft)",
                  color: "var(--color-error)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <LogOut size={18} />
                {language === "bn" ? "লগ আউট" : "Log Out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Small icon button helper ─────────────────────────────────────────────────
const IconBtn: React.FC<{ children: React.ReactNode; onClick?: () => void; title?: string }> = ({
  children,
  onClick,
  title,
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 36,
      height: 36,
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--color-surface-hover)",
      color: "var(--color-text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

export default DashboardPage;

